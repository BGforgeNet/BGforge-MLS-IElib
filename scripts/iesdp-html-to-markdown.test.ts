/**
 * Tests for IESDP HTML to Markdown conversion.
 */

import { describe, it, expect } from "vitest";
import { htmlToMarkdown, stripAllMarkup } from "./iesdp-html-to-markdown";
import { IESDP_BASE_URL } from "./iesdp-url";

describe("htmlToMarkdown", () => {
  it("converts plain text", () => {
    expect(htmlToMarkdown("Hello world", "opcode")).toBe("Hello world");
  });

  it("converts bold tags", () => {
    expect(htmlToMarkdown("<b>bold</b> text", "opcode")).toBe("**bold** text");
  });

  it("converts strong tags", () => {
    expect(htmlToMarkdown("<strong>strong</strong> text", "opcode")).toBe("**strong** text");
  });

  it("converts code tags", () => {
    expect(htmlToMarkdown("<code>value</code>", "opcode")).toBe("`value`");
  });

  it("converts anchor tags with href", () => {
    const result = htmlToMarkdown('<a href="https://example.com">link</a>', "opcode");
    expect(result).toBe("[link](https://example.com)");
  });

  it("resolves relative URLs in anchor tags", () => {
    const result = htmlToMarkdown('<a href="#op190">opcode 190</a>', "opcode");
    expect(result).toBe(`[opcode 190](${IESDP_BASE_URL}/opcodes/bgee.htm#op190)`);
  });

  it("converts unordered lists", () => {
    const html = "<ul><li>one</li><li>two</li></ul>";
    const result = htmlToMarkdown(html, "opcode");
    expect(result).toContain("- one");
    expect(result).toContain("- two");
  });

  it("converts nested lists with indentation", () => {
    const html = "<ul><li>outer<ul><li>inner</li></ul></li></ul>";
    const result = htmlToMarkdown(html, "opcode");
    expect(result).toContain("- outer");
    expect(result).toContain("  - inner");
  });

  it("converts simple tables to markdown pipe tables", () => {
    const html = "<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>";
    const result = htmlToMarkdown(html, "opcode");
    expect(result).toContain("| A");
    expect(result).toContain("| 1");
    expect(result).toContain("---");
  });

  it("converts br tags to newlines", () => {
    expect(htmlToMarkdown("line1<br>line2", "opcode")).toBe("line1\nline2");
  });

  it("strips Jekyll liquid expressions with prepend:relurl", () => {
    const html = '{{ "/path/to/page" | prepend: relurl }}';
    const result = htmlToMarkdown(html, "opcode");
    expect(result).toContain("/path/to/page");
    expect(result).not.toContain("{{");
  });

  it("strips remaining liquid tags", () => {
    const html = "before {{ var }} after {% if x %}y{% endif %}";
    const result = htmlToMarkdown(html, "opcode");
    expect(result).not.toContain("{{");
    expect(result).not.toContain("{%");
    expect(result).toContain("before");
    expect(result).toContain("after");
  });

  it("resolves URLs in existing markdown links", () => {
    const text = "[effect](/opcodes/bgee.htm#op10)";
    const result = htmlToMarkdown(text, "opcode");
    expect(result).toBe(`[effect](${IESDP_BASE_URL}/opcodes/bgee.htm#op10)`);
  });

  it("handles named anchors without href", () => {
    const html = '<a name="effv2_Body_0x14">text</a>';
    const result = htmlToMarkdown(html, "eff_v2");
    expect(result).toContain("[text]");
    expect(result).toContain("effv2_Body_0x14");
  });
});

describe("stripAllMarkup", () => {
  it("strips HTML tags", () => {
    expect(stripAllMarkup("<b>bold</b>")).toBe("bold");
  });

  it("strips markdown links", () => {
    expect(stripAllMarkup("[text](http://example.com)")).toBe("text");
  });

  it("strips markdown bold", () => {
    expect(stripAllMarkup("**bold**")).toBe("bold");
  });

  it("strips markdown code", () => {
    expect(stripAllMarkup("`code`")).toBe("code");
  });

  it("strips combined markup", () => {
    expect(stripAllMarkup('<a href="http://x.com"><b>link</b></a>')).toBe("link");
  });
});
