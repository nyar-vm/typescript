//! TypeScript Node-API export library.
//!
//! This crate does three things only: declare N-API objects, move arguments across
//! the bridge, and map pure Rust results from Boost `language.typescript` back to the
//! host. The parser and language semantics belong to Boost `data.text.typescript`; do
//! not add a parsing or formatting bypass here.

#![deny(missing_docs)]

use data_text_core::{
    parser::session::ParseSession,
    tree::{GreenNode, GreenTree},
};
use data_text_typescript::{TypeScriptLanguage, TypeScriptLexer, TypeScriptParser};
use language_typescript::formatter::{FormatOptions, format_source};
use napi_derive::napi;

/// Kind and byte span of a lexical or syntax leaf.
#[napi(object)]
pub struct TokenSpan {
    /// Leaf kind name (the debug name of `TypeScriptTokenType`).
    pub kind: String,
    /// Start byte offset.
    pub start: u32,
    /// End byte offset (exclusive).
    pub end: u32,
}

/// Syntax tree node exposing only kind and byte span.
#[napi(object)]
pub struct SyntaxNode {
    /// Node kind name (the debug name of `TypeScriptElementType` or `TypeScriptTokenType`).
    pub kind: String,
    /// Start byte offset.
    pub start: u32,
    /// End byte offset (exclusive).
    pub end: u32,
    /// Child nodes; empty for leaves.
    pub children: Vec<SyntaxNode>,
}

/// Parse result.
#[napi(object)]
pub struct ParseOutcome {
    /// Whether a syntax tree was produced.
    pub ok: bool,
    /// Fatal error (present only when `ok = false`).
    pub error: Option<String>,
    /// Non-fatal diagnostics.
    pub diagnostics: Vec<String>,
    /// Syntax tree root.
    pub root: Option<SyntaxNode>,
    /// Number of leaves.
    pub token_count: u32,
}

/// Format result.
#[napi(object)]
pub struct FormatOutcome {
    /// Whether formatted source was produced.
    pub ok: bool,
    /// Formatted source (present only when `ok = true`).
    pub code: Option<String>,
    /// Formatter error (present only when `ok = false`).
    pub error: Option<String>,
}

struct Parsed {
    root: SyntaxNode,
    tokens: Vec<TokenSpan>,
    diagnostics: Vec<String>,
}

fn parse_source(source: &str) -> Result<Parsed, (String, Vec<String>)> {
    let language = TypeScriptLanguage::default();
    let parser = TypeScriptParser::new(&language);
    let lexer = TypeScriptLexer::new(&language);
    let mut cache = ParseSession::<TypeScriptLanguage>::default();
    let output = data_text_core::parser::parse(&parser, &lexer, source, &[], &mut cache);
    let diagnostics = output.diagnostics.iter().map(|error| format!("{error:?}")).collect::<Vec<_>>();

    match output.result {
        Ok(green) => {
            let mut tokens = Vec::new();
            let root = to_syntax_node(green, 0, &mut tokens);
            Ok(Parsed { root, tokens, diagnostics })
        }
        Err(error) => Err((format!("{error:?}"), diagnostics)),
    }
}

fn to_syntax_node(node: &GreenNode<'_, TypeScriptLanguage>, start: u32, tokens: &mut Vec<TokenSpan>) -> SyntaxNode {
    let mut cursor = start;
    let mut children = Vec::with_capacity(node.children.len());

    for child in node.children {
        match child {
            GreenTree::Node(child) => {
                children.push(to_syntax_node(child, cursor, tokens));
                cursor += child.byte_length;
            }
            GreenTree::Leaf(leaf) => {
                let end = cursor + leaf.length;
                let kind = format!("{:?}", leaf.kind);
                tokens.push(TokenSpan { kind: kind.clone(), start: cursor, end });
                children.push(SyntaxNode { kind, start: cursor, end, children: Vec::new() });
                cursor = end;
            }
        }
    }

    SyntaxNode { kind: format!("{:?}", node.kind), start, end: start + node.byte_length, children }
}

/// npm package version (published with the crate version).
#[napi]
pub fn typescript_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Parse TypeScript source and return the syntax tree.
#[napi]
pub fn typescript_parse(source: String) -> ParseOutcome {
    match parse_source(&source) {
        Ok(parsed) => ParseOutcome {
            ok: true,
            error: None,
            diagnostics: parsed.diagnostics,
            token_count: parsed.tokens.len() as u32,
            root: Some(parsed.root),
        },
        Err((error, diagnostics)) => ParseOutcome { ok: false, error: Some(error), diagnostics, root: None, token_count: 0 },
    }
}

/// Lexical leaves in source order.
#[napi]
pub fn typescript_tokens(source: String) -> Vec<TokenSpan> {
    parse_source(&source).map(|parsed| parsed.tokens).unwrap_or_default()
}

/// Diagnostics with the fatal error first.
#[napi]
pub fn typescript_check(source: String) -> Vec<String> {
    match parse_source(&source) {
        Ok(parsed) => parsed.diagnostics,
        Err((error, diagnostics)) => {
            let mut all = Vec::with_capacity(diagnostics.len() + 1);
            all.push(error);
            all.extend(diagnostics);
            all
        }
    }
}

/// Format TypeScript source through the Boost CST formatter.
#[napi]
pub fn typescript_format(source: String) -> FormatOutcome {
    match format_source(&source, &FormatOptions::default()) {
        Ok(code) => FormatOutcome { ok: true, code: Some(code), error: None },
        Err(error) => FormatOutcome { ok: false, code: None, error: Some(format!("{error:?}")) },
    }
}
