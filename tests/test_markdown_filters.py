"""Escaping behaviour of the markdown filters and the modern HTML template."""
import os
import sys
from unittest import mock

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import resume_generator as rg


def md(text):
    return str(rg.convert_markdown_formatting_to_html(rg.convert_markdown_links_to_html(text)))


def test_tags_render_as_text():
    out = md("<script>x()</script> <img src=x>")
    assert "<script" not in out and "<img" not in out
    assert "&lt;script&gt;" in out and "&lt;img src=x&gt;" in out


def test_ampersand_and_lt_are_text():
    assert md("R&D < QA") == "R&amp;D &lt; QA"


def test_unlisted_scheme_has_no_anchor():
    out = md("[a](javascript:alert(1))")
    assert "<a" not in out and "href" not in out


def test_href_is_escaped_single_anchor():
    out = md('[a](https://e.com/?a=1&b="x")')
    assert out.count("<a ") == 1
    assert 'href="https://e.com/?a=1&amp;b=&#34;x&#34;"' in out


def test_markdown_formats_still_work():
    assert md("**b** *i* ~~s~~ ++u++") == "<strong>b</strong> <em>i</em> <s>s</s> <u>u</u>"
    assert md("[x](mailto:a@b.c)") == '<a href="mailto:a@b.c">x</a>'
    assert md("[x](https://e.com)") == '<a href="https://e.com">x</a>'


def test_filters_do_not_double_escape():
    once = rg.convert_markdown_links_to_html("a & b")
    assert str(rg.convert_markdown_links_to_html(once)) == "a &amp; b"


def test_full_render_escapes_plain_fields():
    html = {}

    def fake_from_file(src, out, options=None):
        html["t"] = open(src, encoding="utf-8").read()

    data = {
        "contact_info": {"name": "<b>Jane</b>", "email": "j@e.com", "phone": "1", "location": "<i>X</i>"},
        "sections": [{"name": "<u>S</u>", "type": "text", "content": "hi <b>there</b> **bold**"}],
    }
    with mock.patch.object(rg.pdfkit, "from_file", side_effect=fake_from_file):
        rg.generate_pdf("modern", data, os.devnull)
    t = html["t"]
    assert "&lt;b&gt;Jane&lt;/b&gt;" in t and "<b>Jane</b>" not in t
    assert "&lt;i&gt;X&lt;/i&gt;" in t and "&lt;u&gt;S&lt;/u&gt;" in t
    assert "hi &lt;b&gt;there&lt;/b&gt; <strong>bold</strong>" in t
