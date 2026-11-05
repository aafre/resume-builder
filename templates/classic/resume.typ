// PROTOTYPE (wayfinder typst-latex ticket 03): Typst port of resume.tex.
// Data arrives as values via data.json (never parsed as markup), so no escaping.
// Markdown fields arrive pre-split into runs: [{t, b, i, s, u, l}, ...].

#let d = json("data.json")
#let ci = d.contact_info
#let linkcolor = rgb(51, 51, 153)

// Vertical rhythm is calibrated to the xelatex baselines of the 02 reference PDFs.
// A Typst line box spans cap-height..baseline, so every gap below is
// (xelatex baseline-to-baseline distance) - (cap height of the next line):
// cap height ≈ 6.15pt @9pt, 6.83pt @10pt, 9.84pt @14.4pt, 17pt @24.88pt.
#set document(title: ci.name + " - Resume", author: ci.name)
#set page(paper: "us-letter", margin: 0.75in, numbering: "1", footer-descent: 0%)
#set text(font: "New Computer Modern", size: 10pt, lang: "en")
#set par(justify: true, leading: 5.17pt, spacing: 0pt)
#set block(spacing: 0pt)
#set list(marker: [•], indent: 2.4pt, body-indent: 5.7pt, spacing: 6.3pt)
#show link: set text(fill: linkcolor)

#let md(runs) = for r in runs {
  let c = [#r.t]
  if r.b { c = strong(c) }
  if r.i { c = emph(c) }
  if r.s { c = strike(c) }
  if r.u { c = underline(c) }
  if r.l != none { c = link(r.l, c) }
  c
}

#let small(body) = {
  set text(size: 9pt)
  set par(leading: 4.8pt)
  body
}
// 1em-tall glyph sitting 0.125em below the baseline (FA font metrics), boxed to cap height so it
// does not push the line apart.
#let icon(name) = [#box(height: 0.683em, move(dy: -0.192em, image("icons/" + name + ".svg", height: 1em))) #h(0.5em)]
#let sep = [ #h(0.5em)#sym.dot.c #h(0.5em)]
#let social-icons = (
  linkedin: "linkedin", github: "github", twitter: "twitter", website: "globe",
  stackoverflow: "stack-overflow", medium: "medium", youtube: "youtube",
  behance: "behance", dribbble: "dribbble", pinterest: "pinterest",
)

// --- Header ---
#v(0.4pt)
#align(center, text(size: 24.88pt, weight: "bold", ci.name))
#v(8.07pt)
#let contact(name, body) = box[#icon(name)#body]
#align(center, par(justify: false, {
  contact("map-marker-alt", ci.at("location", default: ""))
  sep; contact("phone", ci.at("phone", default: ""))
  sep; contact("envelope", link("mailto:" + ci.email, ci.email))
  for s in ci.at("social_links", default: ()) {
    if s.at("url", default: "").trim() != "" and s.at("platform", default: "") != "" {
      sep; contact(social-icons.at(s.platform, default: "link"), link(s.url, s.text))
    }
  }
}))

// --- Sections ---
// gap from the heading rule down to the first line, by section type
#let first-gap = (
  "experience": 9.47pt, "education": 10.07pt, "bulleted-list": 6.35pt,
  "icon-list": 6.35pt, "dynamic-column-list": 7.25pt,
)
// gap from a section's last line down to the next heading
#let gap-after = (
  "experience": 18.36pt, "bulleted-list": 18.36pt, "icon-list": 18.36pt, "education": 17.46pt,
)

#let prev = none
#for sec in d.sections {
  let t = lower(sec.at("type", default: ""))
  let items = sec.at("content", default: ())

  v(if prev == none { 26.2pt } else { gap-after.at(prev, default: 16.86pt) })
  prev = t
  block(sticky: true, {
    par(justify: false, text(size: 14.4pt, weight: "bold", sec.name))
    v(8.9pt)
    line(length: 100%, stroke: 0.8pt)
    v(first-gap.at(t, default: 6.05pt))
  })

  if t == "text" {
    small(par(md(items)))
  } else if t == "bulleted-list" or t == "icon-list" {
    set list(spacing: 5.8pt)
    small(list(..items.map(it => if type(it) == dictionary [
      #md(it.certification) (#md(it.issuer), #md(it.date))
    ] else { md(it) })))
  } else if t == "inline-list" {
    small(par(items.map(md).join[ • ]))
  } else if t == "dynamic-column-list" {
    small(grid(columns: (22%,) * 4, column-gutter: 1fr, row-gutter: 4.8pt, ..items.map(md)))
  } else if t == "experience" {
    for (n, job) in items.enumerate() {
      if n > 0 { v(14.07pt) }
      block(sticky: true, {
        par(strong(md(job.title)))
        v(5.17pt)
        par[#emph(md(job.company))#sep#md(job.dates)]
        v(7.75pt)
      })
      let desc = job.at("description", default: none)
      if desc != none and desc.len() > 0 { small(list(..desc.map(md))) }
    }
  } else if t == "education" {
    for (n, edu) in items.enumerate() {
      if n > 0 { v(13.07pt) }
      block(breakable: false, {
        par[#strong(md(edu.degree)), #emph(md(edu.school)) - #md(edu.year)]
        let fos = edu.at("field_of_study", default: none)
        if fos != none and fos.len() > 0 { v(4.85pt); small(par(emph(md(fos)))) }
      })
    }
  } else {
    emph[Unsupported section type: #t]
  }
}
