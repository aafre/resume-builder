"""PROTOTYPE checks for the Typst classic engine (wayfinder typst-latex ticket 03)."""
import pytest

from app import _markdown_to_runs, generate_typst_pdf

pytest.importorskip("typst")


def _r(t, b=False, i=False, s=False, u=False, l=None):
    return {"t": t, "b": b, "i": i, "s": s, "u": u, "l": l}


def test_markdown_runs_match_html_rules():
    assert _markdown_to_runs("a **b** *c* ~~d~~ ++e++ [f](https://x.y/a_b_c)") == [
        _r("a "), _r("b", b=True), _r(" "), _r("c", i=True), _r(" "), _r("d", s=True),
        _r(" "), _r("e", u=True), _r(" "), _r("f", l="https://x.y/a_b_c"),
    ]
    assert _markdown_to_runs("AWS_Lambda ~500 users") == [_r("AWS_Lambda ~500 users")]
    assert _markdown_to_runs(2020) == [_r("2020")]


def test_hostile_text_renders_literally(tmp_path):
    nasty = 'Jane #Doe $&%_{}\\ <x> [y] // @ref = - + "q" #eval("1")'
    data = {
        "contact_info": {"name": nasty, "location": nasty, "phone": "1", "email": "a@b.c"},
        "sections": [
            {"name": nasty, "type": "text", "content": nasty},
            {"name": "Exp", "type": "experience", "content": [
                {"title": nasty, "company": nasty, "dates": nasty, "description": [nasty]}]},
        ],
    }
    out = tmp_path / "r.pdf"
    generate_typst_pdf(data, out)
    assert out.read_bytes()[:4] == b"%PDF"
