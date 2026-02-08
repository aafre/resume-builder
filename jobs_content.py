"""
Content generation for Jobs pSEO pages.

Provides intro copy, FAQs, and salary insight lines per category,
contract type, salary band, and seniority level.

Template selection is deterministic via hash(slug_combo) for consistency.
"""

from __future__ import annotations


# =============================================================================
# Intro copy templates by category
# =============================================================================

CATEGORY_INTROS: dict[str, list[str]] = {
    "engineering": [
        "Browse {num_jobs}+ {role} jobs in {location}. The UK tech sector continues to grow, "
        "with strong demand for skilled engineers across startups and enterprises alike.",
        "Find your next {role} position in {location}. Companies are actively hiring engineers "
        "with expertise in modern development practices and cloud-native technologies.",
        "Explore {role} opportunities in {location}. From greenfield projects to scaling "
        "existing systems, engineering roles offer competitive salaries and career growth.",
        "Discover {num_jobs}+ {role} openings in {location}. Whether you specialise in "
        "frontend, backend, or full stack, there are roles matching your skill set.",
    ],
    "data": [
        "Browse {num_jobs}+ {role} jobs in {location}. Data professionals are in high demand "
        "as companies invest in analytics, machine learning, and data-driven decision making.",
        "Find {role} positions in {location}. Organisations across finance, healthcare, and "
        "tech are building data teams to unlock insights from their growing datasets.",
        "Explore {role} opportunities in {location}. Strong skills in SQL, Python, and "
        "statistical analysis open doors to rewarding careers in the data space.",
    ],
    "design": [
        "Browse {num_jobs}+ {role} jobs in {location}. Great design is a competitive "
        "advantage, and companies are investing in user experience like never before.",
        "Find {role} positions in {location}. From product design to visual identity, "
        "creative professionals shape how millions interact with digital products.",
        "Explore {role} opportunities in {location}. Design thinking and user research "
        "skills are highly valued across tech, finance, and e-commerce sectors.",
    ],
    "management": [
        "Browse {num_jobs}+ {role} jobs in {location}. Strong leaders and project managers "
        "are essential for delivering complex initiatives on time and within budget.",
        "Find {role} positions in {location}. Whether you lead product strategy or "
        "coordinate cross-functional teams, management roles offer significant impact.",
        "Explore {role} opportunities in {location}. Companies value managers who combine "
        "strategic thinking with hands-on execution and stakeholder communication.",
    ],
    "marketing": [
        "Browse {num_jobs}+ {role} jobs in {location}. Digital marketing and sales "
        "professionals drive revenue growth across B2B and B2C organisations.",
        "Find {role} positions in {location}. From content strategy to performance "
        "marketing, there are diverse opportunities in the marketing landscape.",
        "Explore {role} opportunities in {location}. Companies seek marketers who can "
        "combine creativity with data-driven approaches to reach and convert audiences.",
    ],
    "finance": [
        "Browse {num_jobs}+ {role} jobs in {location}. Finance professionals play a "
        "critical role in business strategy, compliance, and financial planning.",
        "Find {role} positions in {location}. From management accounting to financial "
        "analysis, the finance sector offers stable careers with clear progression paths.",
        "Explore {role} opportunities in {location}. Strong analytical skills and "
        "attention to detail are rewarded with competitive compensation packages.",
    ],
    "hr": [
        "Browse {num_jobs}+ {role} jobs in {location}. People professionals shape "
        "company culture, talent strategy, and employee experience.",
        "Find {role} positions in {location}. HR and recruitment roles are evolving "
        "with new tools, remote work practices, and a focus on diversity and inclusion.",
        "Explore {role} opportunities in {location}. Companies increasingly recognise "
        "that great people operations are the foundation of organisational success.",
    ],
    "support": [
        "Browse {num_jobs}+ {role} jobs in {location}. Customer-facing and operations "
        "roles are the backbone of successful businesses.",
        "Find {role} positions in {location}. Strong communication and problem-solving "
        "skills are valued across customer service and office management roles.",
        "Explore {role} opportunities in {location}. Support and operations professionals "
        "keep organisations running smoothly and customers satisfied.",
    ],
    "qa": [
        "Browse {num_jobs}+ {role} jobs in {location}. Quality assurance is critical "
        "for delivering reliable software, and QA professionals are in steady demand.",
        "Find {role} positions in {location}. From manual testing to automated CI/CD "
        "pipelines, QA engineers ensure software quality at every stage.",
        "Explore {role} opportunities in {location}. Companies building complex systems "
        "need skilled QA professionals to maintain high release standards.",
    ],
    "security": [
        "Browse {num_jobs}+ {role} jobs in {location}. Cybersecurity is one of the "
        "fastest-growing fields, with demand far outpacing the supply of qualified professionals.",
        "Find {role} positions in {location}. Security engineers protect organisations "
        "from evolving threats and ensure compliance with data protection regulations.",
        "Explore {role} opportunities in {location}. From penetration testing to "
        "security architecture, there are diverse specialisations within cybersecurity.",
    ],
    "healthcare": [
        "Browse {num_jobs}+ {role} jobs in {location}. Healthcare professionals are "
        "always in demand, with competitive salaries and meaningful career impact.",
        "Find {role} positions in {location}. The UK healthcare sector offers "
        "stable employment with opportunities across the NHS and private practice.",
        "Explore {role} opportunities in {location}. Healthcare careers combine "
        "professional growth with the satisfaction of making a real difference.",
    ],
}


# =============================================================================
# Contract-type specific intros
# =============================================================================

CONTRACT_INTROS: dict[str, list[str]] = {
    "permanent": [
        "Looking for a permanent {role} position in {location}? Browse {num_jobs}+ "
        "full-time roles offering job security, benefits, and long-term career growth.",
        "Find permanent {role} jobs in {location}. Permanent roles typically include "
        "pension contributions, annual leave, and professional development budgets.",
    ],
    "contract": [
        "Browse {num_jobs}+ contract {role} roles in {location}. Contract positions "
        "often offer higher day rates and flexibility for experienced professionals.",
        "Find contract {role} opportunities in {location}. Contractors benefit from "
        "variety, autonomy, and the ability to choose projects that match their skills.",
    ],
    "full-time": [
        "Explore {num_jobs}+ full-time {role} positions in {location}. Full-time roles "
        "offer stability, team integration, and structured career progression.",
    ],
    "part-time": [
        "Browse {num_jobs}+ part-time {role} jobs in {location}. Part-time positions "
        "provide flexibility while maintaining professional engagement and income.",
    ],
}


# =============================================================================
# Salary-band specific intros
# =============================================================================

SALARY_INTROS: list[str] = [
    "Browse {num_jobs}+ {role} jobs in {location} paying {salary_label} per year. "
    "These roles reflect strong demand for experienced professionals in this salary range.",
    "Find {role} positions in {location} with salaries of {salary_label}+. "
    "Higher-paying roles typically require deeper specialisation or leadership experience.",
]


# =============================================================================
# Seniority-specific intros
# =============================================================================

SENIORITY_INTROS: dict[str, list[str]] = {
    "junior": [
        "Browse {num_jobs}+ junior {role} jobs in {location}. Entry-level and junior "
        "positions are ideal for graduates and early-career professionals looking to build experience.",
        "Find junior {role} opportunities in {location}. Many companies offer "
        "mentorship programmes and structured onboarding for junior hires.",
    ],
    "mid": [
        "Explore {num_jobs}+ mid-level {role} jobs in {location}. With 2-5 years of "
        "experience, mid-level professionals are highly sought after for their blend of "
        "skills and adaptability.",
    ],
    "senior": [
        "Browse {num_jobs}+ senior {role} jobs in {location}. Senior roles come with "
        "greater responsibility, technical leadership, and significantly higher compensation.",
        "Find senior {role} positions in {location}. Companies value senior professionals "
        "who can mentor teams, drive architecture decisions, and deliver complex projects.",
    ],
    "lead": [
        "Browse {num_jobs}+ lead {role} jobs in {location}. Lead roles combine deep "
        "technical expertise with team leadership and strategic influence.",
        "Find lead {role} positions in {location}. As a lead, you will shape technical "
        "direction while mentoring and growing your team.",
    ],
}


# =============================================================================
# Freshness-specific intros
# =============================================================================

FRESHNESS_INTROS: dict[str, list[str]] = {
    "posted-today": [
        "See the latest {role} jobs posted today in {location}. Fresh listings mean "
        "less competition — apply early for the best chance of getting noticed.",
    ],
    "posted-this-week": [
        "Browse {role} jobs posted this week in {location}. These recent listings "
        "represent active hiring — companies are looking to fill these positions now.",
    ],
}


# =============================================================================
# FAQ templates by category
# =============================================================================

CATEGORY_FAQS: dict[str, list[dict[str, str]]] = {
    "engineering": [
        {
            "question": "What skills do I need for {role} jobs in {location}?",
            "answer": "Most {role} positions require proficiency in relevant programming "
            "languages, frameworks, and tools. Key skills often include {top_skills}. "
            "Strong problem-solving abilities and experience with version control (Git) "
            "are expected across nearly all engineering roles.",
        },
        {
            "question": "What is the average salary for a {role} in {location}?",
            "answer": "{salary_insight} Salaries vary based on experience, company size, "
            "and specific technology stack. Senior and lead roles typically command "
            "significantly higher compensation.",
        },
        {
            "question": "Are {role} jobs available remotely?",
            "answer": "Yes, many {role} positions offer remote or hybrid working "
            "arrangements. The shift to remote work has expanded opportunities beyond "
            "{location}, though some companies still prefer candidates within commuting distance.",
        },
        {
            "question": "How can I stand out when applying for {role} jobs?",
            "answer": "Tailor your CV to highlight relevant projects and technologies. "
            "Include a portfolio or GitHub profile demonstrating your work. Use our "
            "free resume builder to create an ATS-friendly CV that showcases your "
            "engineering experience effectively.",
        },
    ],
    "data": [
        {
            "question": "What qualifications do I need for {role} positions?",
            "answer": "Most {role} roles require strong skills in {top_skills}. "
            "A degree in mathematics, statistics, computer science, or a related field "
            "is often preferred, though practical experience and certifications can "
            "substitute for formal qualifications.",
        },
        {
            "question": "What is the salary range for {role} jobs in {location}?",
            "answer": "{salary_insight} Data roles tend to command premium salaries, "
            "particularly for professionals with machine learning or cloud platform expertise.",
        },
        {
            "question": "What tools should I know for {role} roles?",
            "answer": "Common tools include SQL, Python (pandas, scikit-learn), "
            "visualisation tools (Tableau, Power BI), and cloud platforms (AWS, GCP, Azure). "
            "The specific stack varies by company and role level.",
        },
    ],
    "design": [
        {
            "question": "What skills are essential for {role} jobs?",
            "answer": "Key skills include proficiency in design tools like Figma, Sketch, "
            "or Adobe Creative Suite. UX roles also value user research, wireframing, "
            "prototyping, and understanding of accessibility standards.",
        },
        {
            "question": "What is the average {role} salary in {location}?",
            "answer": "{salary_insight} Design salaries vary based on specialisation, "
            "portfolio quality, and industry sector.",
        },
        {
            "question": "Do I need a portfolio for {role} applications?",
            "answer": "Yes, a strong portfolio is essential. Include case studies showing "
            "your design process, from research and ideation to final implementation. "
            "Quality matters more than quantity — 3-5 well-documented projects are "
            "better than a dozen surface-level pieces.",
        },
    ],
    "management": [
        {
            "question": "What experience is needed for {role} positions?",
            "answer": "Most {role} positions require 3-7+ years of relevant experience, "
            "including some time in a leadership or coordination capacity. Certifications "
            "like PMP, PRINCE2, or Certified Scrum Master can strengthen your application.",
        },
        {
            "question": "What is the salary range for {role} jobs in {location}?",
            "answer": "{salary_insight} Management roles often include bonuses and "
            "equity components beyond base salary.",
        },
        {
            "question": "What soft skills matter for {role} roles?",
            "answer": "Communication, stakeholder management, and strategic thinking are "
            "critical. Strong {role} candidates also demonstrate conflict resolution, "
            "resource planning, and the ability to balance competing priorities.",
        },
    ],
    "marketing": [
        {
            "question": "What skills do {role} jobs require?",
            "answer": "Key skills include {top_skills}. Digital marketing roles "
            "increasingly value data literacy, A/B testing experience, and familiarity "
            "with marketing automation platforms.",
        },
        {
            "question": "What is the average {role} salary in {location}?",
            "answer": "{salary_insight} Marketing salaries vary significantly between "
            "B2B and B2C sectors, and by company size.",
        },
        {
            "question": "How do I transition into {role} roles?",
            "answer": "Build a portfolio of marketing projects, gain certifications "
            "(Google Ads, HubSpot, Meta Blueprint), and develop analytical skills. "
            "Use our resume builder to highlight transferable skills from other fields.",
        },
    ],
    "finance": [
        {
            "question": "What qualifications do I need for {role} jobs?",
            "answer": "Most {role} roles require a degree in accounting, finance, or a "
            "related field. Professional qualifications like ACA, ACCA, CIMA, or CFA "
            "are often required or strongly preferred.",
        },
        {
            "question": "What is the salary range for {role} positions in {location}?",
            "answer": "{salary_insight} Finance roles in London and major cities "
            "typically offer higher compensation to reflect cost of living.",
        },
        {
            "question": "What software skills are valued in {role} positions?",
            "answer": "Proficiency in Excel is essential, along with experience in "
            "accounting software (Sage, Xero, QuickBooks), ERP systems (SAP, Oracle), "
            "and increasingly, data analysis tools like Power BI or Python.",
        },
    ],
    "hr": [
        {
            "question": "What qualifications help for {role} positions?",
            "answer": "CIPD qualifications (Level 3, 5, or 7) are widely recognised in "
            "the UK. Experience with HR systems (Workday, BambooHR, SAP SuccessFactors) "
            "and knowledge of employment law are also valued.",
        },
        {
            "question": "What is the average {role} salary in {location}?",
            "answer": "{salary_insight} HR roles at senior levels, particularly HR "
            "Directors and People VPs, command premium salaries.",
        },
    ],
    "support": [
        {
            "question": "What skills matter for {role} jobs?",
            "answer": "Strong communication, problem-solving, and organisational skills "
            "are essential. Experience with relevant software and tools, plus a "
            "customer-focused mindset, will set you apart from other candidates.",
        },
        {
            "question": "What is the salary range for {role} positions in {location}?",
            "answer": "{salary_insight} Salaries increase with experience and "
            "specialisation, particularly in customer success management.",
        },
    ],
    "qa": [
        {
            "question": "What skills are needed for {role} jobs?",
            "answer": "Key skills include {top_skills}. QA roles value experience "
            "with test automation frameworks, CI/CD pipelines, and both manual and "
            "automated testing methodologies.",
        },
        {
            "question": "What is the average {role} salary in {location}?",
            "answer": "{salary_insight} QA engineers with automation skills typically "
            "earn more than those focused solely on manual testing.",
        },
    ],
    "security": [
        {
            "question": "What certifications help for {role} positions?",
            "answer": "Certifications like CISSP, CEH, CompTIA Security+, and OSCP are "
            "widely valued. Cloud security certifications (AWS Security Specialty, "
            "Azure Security Engineer) are increasingly important.",
        },
        {
            "question": "What is the salary range for {role} jobs in {location}?",
            "answer": "{salary_insight} Security professionals command premium salaries "
            "due to the high demand and shortage of qualified candidates.",
        },
    ],
    "healthcare": [
        {
            "question": "What qualifications do I need for {role} jobs?",
            "answer": "Healthcare roles require appropriate professional registration "
            "(NMC for nurses, GMC for doctors). Relevant degrees, clinical placements, "
            "and continued professional development are essential.",
        },
        {
            "question": "What is the salary range for {role} positions in {location}?",
            "answer": "{salary_insight} NHS roles follow Agenda for Change pay bands, "
            "while private sector positions may offer different compensation structures.",
        },
    ],
}


# =============================================================================
# Salary insight line
# =============================================================================

def format_salary_insight(salary_stats: dict | None, role_display: str, location: str) -> str:
    """Generate a salary insight sentence from aggregated salary data."""
    if not salary_stats or salary_stats.get("sample_size", 0) < 3:
        return f"Salary data for {role_display} roles in {location} varies by experience and employer."

    currency = salary_stats.get("currency", "£")
    median = salary_stats.get("median", 0)
    low = salary_stats.get("min", 0)
    high = salary_stats.get("max", 0)

    if median and low and high:
        return (
            f"Based on current listings, {role_display} salaries in {location} range "
            f"from {currency}{low:,} to {currency}{high:,}, with a median of "
            f"{currency}{median:,} per year."
        )
    if median:
        return (
            f"The median salary for {role_display} roles in {location} is "
            f"approximately {currency}{median:,} per year based on current listings."
        )
    return f"Salary data for {role_display} roles in {location} varies by experience and employer."


# =============================================================================
# Template selection (deterministic)
# =============================================================================

def _select_template(templates: list[str], slug_combo: str) -> str:
    """Deterministically select a template based on slug combination hash."""
    idx = hash(slug_combo) % len(templates)
    return templates[idx]


# =============================================================================
# Public API
# =============================================================================

def get_intro_copy(
    category: str,
    role_display: str,
    location: str,
    num_jobs: int,
    slug_combo: str,
    modifier: str | None = None,
    seniority: str | None = None,
    salary_label: str | None = None,
) -> str:
    """Get the intro copy for a pSEO page."""
    # Pick template based on page variant
    if seniority and seniority in SENIORITY_INTROS:
        templates = SENIORITY_INTROS[seniority]
    elif modifier and modifier in FRESHNESS_INTROS:
        templates = FRESHNESS_INTROS[modifier]
    elif modifier and modifier in CONTRACT_INTROS:
        templates = CONTRACT_INTROS[modifier]
    elif salary_label:
        templates = SALARY_INTROS
    else:
        templates = CATEGORY_INTROS.get(category, CATEGORY_INTROS["engineering"])

    template = _select_template(templates, slug_combo)

    return template.format(
        role=role_display,
        location=location,
        num_jobs=num_jobs,
        salary_label=salary_label or "",
    )


def get_faqs(
    category: str,
    role_display: str,
    location: str,
    top_skills: list[str] | None = None,
    salary_stats: dict | None = None,
) -> list[dict[str, str]]:
    """Get FAQ list for a pSEO page, with variables filled in."""
    templates = CATEGORY_FAQS.get(category, CATEGORY_FAQS["engineering"])

    skills_str = ", ".join(top_skills[:5]) if top_skills else "relevant technical skills"
    salary_insight = format_salary_insight(salary_stats, role_display, location)

    faqs = []
    for tpl in templates:
        faqs.append({
            "question": tpl["question"].format(role=role_display, location=location),
            "answer": tpl["answer"].format(
                role=role_display,
                location=location,
                top_skills=skills_str,
                salary_insight=salary_insight,
            ),
        })

    return faqs
