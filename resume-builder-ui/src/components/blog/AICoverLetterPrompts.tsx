import BlogLayout from '../BlogLayout';
import { Link } from 'react-router-dom';
import CopyablePrompt from '../shared/CopyablePrompt';

export default function AICoverLetterPrompts() {
  return (
    <BlogLayout
      title="25+ AI Cover Letter Prompts (Copy-Paste Ready for Any AI Tool)"
      description="AI cover letter prompts that actually work: tailored cover letters, opening hooks, career changes, follow-ups, and thank-you notes. Copy-paste ready for ChatGPT, Claude, Copilot, and Gemini."
      publishDate="2026-03-05"
      readTime="16 min"
      keywords={[
        'ai cover letter prompts',
        'chatgpt cover letter',
        'ai cover letter generator',
        'cover letter prompts',
        'ai cover letter writing',
        'cover letter chatgpt prompts',
      ]}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          A great cover letter can be the difference between an interview and a rejection &mdash; but
          most people hate writing them. These 25+ AI prompts work with any major AI tool (ChatGPT,
          Claude, Gemini, Copilot, DeepSeek) and cover every scenario from standard applications to
          career changes to post-interview follow-ups.
        </p>

        {/* Table of Contents */}
        <nav className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h2 className="font-bold text-ink mb-4 text-lg">Table of Contents</h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#before-you-start" className="text-accent hover:underline">Before You Start: What AI Needs From You</a></li>
            <li><a href="#tailored-cover-letters" className="text-accent hover:underline">Tailored Cover Letter Prompts (#1-5)</a></li>
            <li><a href="#opening-hooks" className="text-accent hover:underline">Opening Hook Prompts (#6-9)</a></li>
            <li><a href="#career-change" className="text-accent hover:underline">Career Change Cover Letters (#10-13)</a></li>
            <li><a href="#internal-transfer" className="text-accent hover:underline">Internal Transfer &amp; Referral (#14-16)</a></li>
            <li><a href="#follow-up-emails" className="text-accent hover:underline">Follow-Up Emails (#17-20)</a></li>
            <li><a href="#thank-you-notes" className="text-accent hover:underline">Thank-You Notes (#21-24)</a></li>
            <li><a href="#review-polish" className="text-accent hover:underline">Review &amp; Polish (#25-27)</a></li>
            <li><a href="#which-ai" className="text-accent hover:underline">Which AI Tool to Use</a></li>
            <li><a href="#tips" className="text-accent hover:underline">Tips for Better Results</a></li>
          </ol>
        </nav>

        {/* Before You Start */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-8">
          <h3 id="before-you-start" className="font-bold text-ink mb-3">Before You Start: What AI Needs From You</h3>
          <p className="text-ink/80 mb-3">
            AI cover letters are only as good as the context you provide. Before using any prompt below,
            have these ready:
          </p>
          <ul className="space-y-2 text-ink/80">
            <li><strong>The job description</strong> &mdash; paste the full text, not a summary</li>
            <li><strong>Your resume or key achievements</strong> &mdash; with specific metrics</li>
            <li><strong>Why this company</strong> &mdash; one genuine, specific reason (a product you use, a value you share, a recent news item)</li>
            <li><strong>Your strongest qualification</strong> &mdash; the single thing that makes you a great fit</li>
          </ul>
          <p className="text-ink/80 mt-3">
            Generic inputs produce generic cover letters. The more specific you are, the better the output.
            For a full guide on cover letter writing fundamentals, see our{' '}
            <Link to="/blog/cover-letter-guide" className="text-accent hover:underline">
              cover letter writing guide
            </Link>.
          </p>
        </div>

        {/* Tailored Cover Letters */}
        <h2 id="tailored-cover-letters" className="text-3xl font-bold text-ink mt-12 mb-6">
          Tailored Cover Letter Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          These prompts generate complete, job-specific cover letters. The key is providing enough
          context for the AI to write something that sounds like you, not like a template.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #1: Full Tailored Cover Letter" bestFor="Standard job applications where the cover letter matters">
            Write a cover letter for [JOB TITLE] at [COMPANY NAME].<br /><br />
            My background:<br />
            - Current role: [ROLE] at [COMPANY] for [X] years<br />
            - Key achievement #1: [ACHIEVEMENT WITH METRIC]<br />
            - Key achievement #2: [ACHIEVEMENT WITH METRIC]<br />
            - Why this company: [SPECIFIC REASON &mdash; a product, mission, recent news, or personal connection]<br /><br />
            Job description highlights:<br />
            [PASTE 3-5 KEY REQUIREMENTS FROM THE JOB DESCRIPTION]<br /><br />
            Rules:<br />
            - 3 paragraphs max (opening hook, value I bring, closing with call to action)<br />
            - Do not repeat my resume verbatim &mdash; add context and connect dots<br />
            - Reference something specific about the company (not generic praise)<br />
            - Sound confident but not arrogant<br />
            - Keep under 300 words total<br />
            - Do not start with &ldquo;I am writing to apply for...&rdquo;
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #2: Cover Letter From Resume + JD" bestFor="When you want AI to match your resume to the job">
            Here is my resume and a job description. Write a cover letter that bridges the two.<br /><br />
            My resume:<br />
            [PASTE YOUR FULL RESUME]<br /><br />
            Job description:<br />
            [PASTE THE FULL JOB DESCRIPTION]<br /><br />
            Instructions:<br />
            - Identify 2-3 experiences from my resume that best match the job requirements<br />
            - Expand on those experiences with context not already in the resume<br />
            - Do NOT simply restate resume bullets &mdash; explain the &ldquo;so what&rdquo;<br />
            - Address any obvious gaps between my background and the requirements<br />
            - 3 paragraphs, under 300 words, no &ldquo;I am writing to apply&rdquo; opening
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #3: Startup Cover Letter" bestFor="Applying to startups where culture fit matters">
            Write a cover letter for [JOB TITLE] at [STARTUP NAME], a [STAGE, e.g., &ldquo;Series B&rdquo;] startup in [INDUSTRY].<br /><br />
            My background: [2-3 SENTENCES ABOUT YOUR EXPERIENCE]<br />
            What excites me about this startup: [SPECIFIC PRODUCT/MISSION/PROBLEM THEY SOLVE]<br /><br />
            Rules for startup cover letters:<br />
            - Shorter is better &mdash; aim for 200 words or less<br />
            - Show you understand their stage and challenges<br />
            - Emphasize adaptability and ownership mentality<br />
            - Skip formal language &mdash; match their website&rsquo;s tone<br />
            - End with genuine enthusiasm, not a generic closing
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #4: Enterprise/Corporate Cover Letter" bestFor="Applying to Fortune 500 and large organizations">
            Write a cover letter for [JOB TITLE] at [COMPANY], a [INDUSTRY] company with [SIZE, e.g., &ldquo;50,000+ employees&rdquo;].<br /><br />
            My background:<br />
            - [X] years in [FIELD]<br />
            - Key achievement: [ACHIEVEMENT WITH SCALE/METRIC]<br />
            - Relevant experience with: [ENTERPRISE TOOLS, PROCESSES, or METHODOLOGIES]<br /><br />
            Job description:<br />
            [PASTE KEY REQUIREMENTS]<br /><br />
            Rules for enterprise cover letters:<br />
            - Professional but not stiff<br />
            - Emphasize ability to work at scale and within structured processes<br />
            - Reference specific business outcomes (revenue, efficiency, compliance)<br />
            - 3 paragraphs, under 300 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #5: Remote Position Cover Letter" bestFor="Remote-first roles where self-management matters">
            Write a cover letter for [REMOTE JOB TITLE] at [COMPANY].<br /><br />
            My remote work experience:<br />
            - [X] years working remotely<br />
            - Tools I use daily: [SLACK, ZOOM, NOTION, etc.]<br />
            - Example of async collaboration success: [BRIEF EXAMPLE]<br /><br />
            Job requirements:<br />
            [PASTE KEY REQUIREMENTS]<br /><br />
            Emphasize:<br />
            - Self-management and proactive communication<br />
            - Time zone awareness (I am in [TIME ZONE])<br />
            - Concrete examples of remote collaboration, not just &ldquo;I work well independently&rdquo;<br />
            - Under 250 words
          </CopyablePrompt>
        </div>

        {/* Opening Hooks */}
        <h2 id="opening-hooks" className="text-3xl font-bold text-ink mt-12 mb-6">
          Opening Hook Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          The first sentence determines whether the hiring manager keeps reading. These prompts
          generate attention-grabbing openers that lead with value instead of the tired
          &ldquo;I am writing to apply for...&rdquo; formula.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #6: Achievement-Led Opening" bestFor="When you have a strong, relevant accomplishment">
            Write 3 different opening sentences for a cover letter applying to [JOB TITLE] at [COMPANY].<br /><br />
            My strongest qualification: [YOUR TOP SELLING POINT WITH A METRIC]<br /><br />
            Rules for each opening:<br />
            - Do NOT start with &ldquo;I am writing to&rdquo; or &ldquo;I am excited to&rdquo;<br />
            - Lead with the achievement or value, not with a request<br />
            - Make the hiring manager want to read sentence two<br />
            - Under 30 words each<br />
            - Each should use a different approach (metric-led, question, bold statement)
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #7: Connection-Led Opening" bestFor="When you have a referral or personal connection">
            Write an opening paragraph for a cover letter where I was referred by [REFERRER NAME],
            who is a [THEIR ROLE] at [COMPANY].<br /><br />
            What they told me about the role: [BRIEF DETAIL]<br />
            My relevant qualification: [YOUR TOP SELLING POINT]<br /><br />
            Rules:<br />
            - Mention the referral naturally in the first sentence<br />
            - Immediately follow with why I am a strong fit<br />
            - Do not make the entire paragraph about the referral &mdash; pivot to value quickly<br />
            - Under 50 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #8: Problem-Led Opening" bestFor="When you understand the company's challenges">
            Write an opening line for a cover letter to [COMPANY] for [JOB TITLE].<br /><br />
            A challenge I believe this company faces: [SPECIFIC CHALLENGE, e.g., &ldquo;scaling customer support as they expand internationally&rdquo;]<br />
            How I have solved a similar problem: [BRIEF DESCRIPTION]<br /><br />
            The opening should:<br />
            - Reference their challenge without being presumptuous<br />
            - Hint at my relevant experience<br />
            - Make them think &ldquo;this person gets it&rdquo;<br />
            - Under 30 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #9: User/Customer-Led Opening" bestFor="When you genuinely use the company's product">
            Write an opening for a cover letter to [COMPANY] where I am a genuine user of their product [PRODUCT NAME].<br /><br />
            How I use it: [BRIEF DESCRIPTION OF YOUR USE CASE]<br />
            What I appreciate about it: [SPECIFIC FEATURE OR EXPERIENCE]<br />
            Role I am applying for: [JOB TITLE]<br /><br />
            Rules:<br />
            - Be specific about the product &mdash; prove I actually use it<br />
            - Transition naturally from user experience to professional contribution<br />
            - Avoid sycophantic praise &mdash; be genuine<br />
            - Under 40 words
          </CopyablePrompt>
        </div>

        {/* Career Change */}
        <h2 id="career-change" className="text-3xl font-bold text-ink mt-12 mb-6">
          Career Change Cover Letter Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Switching careers is one of the hardest cover letter scenarios. You need to acknowledge the
          transition, frame it as a strength, and prove your transferable skills &mdash; all without
          being defensive. For resume-specific guidance, see our{' '}
          <Link to="/blog/professional-summary-examples" className="text-accent hover:underline">
            professional summary examples
          </Link>{' '}
          for career changers.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #10: Career Change Cover Letter (Full)" bestFor="Major industry or role transitions">
            Write a cover letter for someone transitioning from [CURRENT FIELD/ROLE] to [TARGET FIELD/ROLE].<br /><br />
            My background:<br />
            - Current role: [ROLE] with [X] years experience<br />
            - Transferable skills: [SKILL 1], [SKILL 2], [SKILL 3]<br />
            - What I have done to prepare: [CERTIFICATIONS, COURSES, SIDE PROJECTS, VOLUNTEER WORK]<br />
            - Why I am making this change: [HONEST, POSITIVE REASON]<br /><br />
            Target job description:<br />
            [PASTE KEY REQUIREMENTS]<br /><br />
            Rules:<br />
            - Address the career change directly in paragraph 1 &mdash; do not hide it<br />
            - Frame the transition as an asset (&ldquo;my perspective from [field] gives me...&rdquo;)<br />
            - Do NOT be apologetic about the switch<br />
            - Map each transferable skill to a specific job requirement<br />
            - Show evidence of commitment to the new field (not just interest)<br />
            - 3 paragraphs, under 300 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #11: Military-to-Civilian Transition" bestFor="Veterans entering the private sector">
            Write a cover letter for a military veteran transitioning to [CIVILIAN JOB TITLE].<br /><br />
            Military background:<br />
            - Branch: [BRANCH], Rank: [RANK]<br />
            - Years of service: [X]<br />
            - Key roles: [MILITARY ROLES/RESPONSIBILITIES]<br />
            - Achievements: [ACCOMPLISHMENTS, translated to civilian terms if possible]<br /><br />
            Target role requirements:<br />
            [PASTE KEY REQUIREMENTS]<br /><br />
            Rules:<br />
            - Translate ALL military jargon into civilian language<br />
            - Connect military leadership, logistics, and problem-solving to the role<br />
            - Do not over-emphasize military identity &mdash; focus on what I bring to THIS job<br />
            - Confident tone without being rigid<br />
            - Under 300 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #12: Return-to-Work Cover Letter" bestFor="Returning after a career gap (parenting, health, sabbatical)">
            Write a cover letter for someone returning to work after a [LENGTH] gap for [REASON, e.g., &ldquo;raising children&rdquo; / &ldquo;caregiving&rdquo; / &ldquo;health recovery&rdquo; / &ldquo;sabbatical&rdquo;].<br /><br />
            My pre-gap experience:<br />
            - Last role: [ROLE] at [COMPANY] ([YEAR LEFT])<br />
            - Key skills: [SKILL 1], [SKILL 2], [SKILL 3]<br />
            - During the gap I: [ANY RELEVANT ACTIVITIES &mdash; freelance, volunteering, courses]<br /><br />
            Target role: [JOB TITLE] at [COMPANY]<br /><br />
            Rules:<br />
            - Acknowledge the gap briefly and positively (1 sentence, no over-explaining)<br />
            - Focus 80% of the letter on what I bring to the role<br />
            - Highlight any skills maintained or gained during the gap<br />
            - Do NOT be apologetic<br />
            - Under 250 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #13: Transitioning Paragraph Only" bestFor="When you need just the career-change paragraph, not the full letter">
            Write a single paragraph (60-80 words) explaining my career transition from [CURRENT FIELD] to [TARGET FIELD] for a cover letter.<br /><br />
            Transferable skills: [SKILL 1], [SKILL 2], [SKILL 3]<br />
            Preparation: [WHAT I HAVE DONE TO PREPARE]<br /><br />
            The paragraph should:<br />
            - Acknowledge the transition in the first sentence<br />
            - Frame it as bringing a unique perspective<br />
            - End with a forward-looking statement about what I will contribute
          </CopyablePrompt>
        </div>

        {/* Internal Transfer & Referral */}
        <h2 id="internal-transfer" className="text-3xl font-bold text-ink mt-12 mb-6">
          Internal Transfer &amp; Referral Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Internal applications and referral-based applications need a different tone. You already
          have context and relationships &mdash; your letter should reflect that.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #14: Internal Transfer Request" bestFor="Moving to a new role within your company">
            Write a cover letter for an internal transfer at [COMPANY] from [CURRENT ROLE/DEPARTMENT]
            to [TARGET ROLE/DEPARTMENT].<br /><br />
            My relevant experience:<br />
            - [KEY CONTRIBUTION TO CURRENT TEAM]<br />
            - [CROSS-FUNCTIONAL WORK RELATED TO TARGET ROLE]<br />
            - [SKILL OR PROJECT THAT QUALIFIES ME]<br /><br />
            Why I want this move: [HONEST REASON &mdash; growth, interest, skills alignment]<br /><br />
            Rules:<br />
            - Open by acknowledging appreciation for current team<br />
            - Focus on what I bring to the new team, not what I want to escape<br />
            - Reference specific internal knowledge that makes me valuable<br />
            - Professional but warm tone (these people know me)<br />
            - Under 200 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #15: Referral Cover Letter" bestFor="When someone inside the company referred you">
            Write a cover letter for [JOB TITLE] at [COMPANY]. I was referred by [NAME], who is [THEIR ROLE] there.<br /><br />
            What [NAME] told me about the role/team: [BRIEF DETAIL]<br />
            My relevant experience: [2-3 KEY QUALIFICATIONS]<br />
            Job description highlights: [PASTE 3-4 KEY REQUIREMENTS]<br /><br />
            Rules:<br />
            - Mention the referral in the first sentence naturally<br />
            - Do not make the whole letter about the referral<br />
            - Connect what [NAME] shared about the role to my specific experience<br />
            - 3 paragraphs, under 250 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #16: Networking Follow-Up to Application" bestFor="When you met someone at an event and want to apply">
            Write a cover letter for [JOB TITLE] at [COMPANY]. I met [CONTACT NAME] at [EVENT/CONTEXT]
            and we discussed [TOPIC].<br /><br />
            What we talked about: [KEY POINTS FROM CONVERSATION]<br />
            My relevant background: [2-3 KEY QUALIFICATIONS]<br /><br />
            Rules:<br />
            - Reference the specific conversation (not just &ldquo;we met at a conference&rdquo;)<br />
            - Transition naturally from the connection to my qualifications<br />
            - Under 250 words
          </CopyablePrompt>
        </div>

        {/* Follow-Up Emails */}
        <h2 id="follow-up-emails" className="text-3xl font-bold text-ink mt-12 mb-6">
          Follow-Up Email Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Following up shows genuine interest &mdash; but there is a fine line between persistent and
          pushy. These prompts generate professional follow-ups for every stage of the application process.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #17: Application Follow-Up (1 Week)" bestFor="Following up after submitting an application">
            Write a follow-up email for a [JOB TITLE] application at [COMPANY] submitted [X] days ago.<br /><br />
            Key qualification I want to highlight: [YOUR STRONGEST SELLING POINT]<br /><br />
            Rules:<br />
            - Subject line: brief and specific (include the job title)<br />
            - 3-4 sentences max<br />
            - Reaffirm interest without sounding desperate<br />
            - Add one new piece of value (a relevant article, insight, or accomplishment) not in my original application<br />
            - End with a soft ask, not a demand (&ldquo;Would it be helpful if I...&rdquo; not &ldquo;When can I expect to hear back?&rdquo;)
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #18: Post-Phone-Screen Follow-Up" bestFor="After an initial phone or recruiter screen">
            Write a follow-up email after a phone screen for [JOB TITLE] at [COMPANY].<br /><br />
            Interviewer: [NAME, TITLE]<br />
            Key topics discussed: [2-3 MAIN POINTS]<br />
            Something they seemed excited about: [DETAIL]<br />
            Next step mentioned: [WHAT THEY SAID ABOUT NEXT STEPS]<br /><br />
            Rules:<br />
            - Thank them by name<br />
            - Reference a specific part of the conversation<br />
            - Reinforce one key qualification<br />
            - Express enthusiasm for the next step they mentioned<br />
            - Under 100 words
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #19: Follow-Up After No Response" bestFor="Second follow-up when you haven't heard back">
            Write a second follow-up email for [JOB TITLE] at [COMPANY]. My first follow-up was [X] days ago and I have not heard back.<br /><br />
            Rules:<br />
            - Acknowledge they are busy (without being passive-aggressive)<br />
            - Keep it to 2-3 sentences<br />
            - Offer to provide additional information<br />
            - Make it easy for them to respond (&ldquo;A quick yes or no on whether the role is still open would be helpful&rdquo;)<br />
            - Graceful, not pushy
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #20: Withdrawal Email" bestFor="Professionally declining or withdrawing an application">
            Write an email to withdraw my application for [JOB TITLE] at [COMPANY].<br /><br />
            Reason: [ACCEPTED ANOTHER OFFER / ROLE NO LONGER ALIGNS / PERSONAL REASONS]<br />
            Person I have been communicating with: [NAME, TITLE]<br /><br />
            Rules:<br />
            - Thank them for their time<br />
            - Give a brief, professional reason (not overly detailed)<br />
            - Leave the door open for future opportunities<br />
            - Under 80 words
          </CopyablePrompt>
        </div>

        {/* Thank-You Notes */}
        <h2 id="thank-you-notes" className="text-3xl font-bold text-ink mt-12 mb-6">
          Thank-You Note Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Sending a thank-you note within 24 hours of an interview is one of the simplest ways to
          stand out. These prompts generate notes that go beyond &ldquo;thank you for your time.&rdquo;
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #21: Post-Interview Thank You" bestFor="After a standard job interview">
            Write a thank-you email after interviewing for [JOB TITLE] at [COMPANY].<br /><br />
            Interviewer: [NAME, TITLE]<br />
            Topics we discussed: [2-3 KEY TOPICS]<br />
            Something specific they said that resonated: [QUOTE OR PARAPHRASE]<br />
            A question I wish I had answered better: [TOPIC]<br /><br />
            Rules:<br />
            - Reference a specific moment from the conversation (prove I was listening)<br />
            - Briefly address the question I could have answered better (add the answer now)<br />
            - Reaffirm why I am excited about the role<br />
            - Under 150 words<br />
            - Send-ready within 24 hours
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #22: Panel Interview Thank You (Multiple People)" bestFor="When you interviewed with 3+ people">
            Write [NUMBER] separate thank-you emails for a panel interview for [JOB TITLE] at [COMPANY].<br /><br />
            Panelists:<br />
            1. [NAME, TITLE] &mdash; we discussed [TOPIC]<br />
            2. [NAME, TITLE] &mdash; we discussed [TOPIC]<br />
            3. [NAME, TITLE] &mdash; we discussed [TOPIC]<br /><br />
            Rules:<br />
            - Each email should be unique (they may compare notes)<br />
            - Reference what each person specifically asked about or discussed<br />
            - Each email under 100 words<br />
            - Same core message but different personal details
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #23: Thank You After Rejection" bestFor="Maintaining the relationship after being turned down">
            Write a brief, gracious response to a rejection for [JOB TITLE] at [COMPANY].<br /><br />
            Person who notified me: [NAME]<br />
            Something I genuinely appreciated about the process: [DETAIL]<br /><br />
            Rules:<br />
            - Thank them sincerely (not sarcastically)<br />
            - Mention one positive thing about the interview experience<br />
            - Ask to stay in touch for future opportunities<br />
            - Under 60 words<br />
            - No bitterness, no fishing for feedback (unless the relationship warrants it)
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #24: Informational Interview Thank You" bestFor="After a networking or informational conversation">
            Write a thank-you email after an informational interview with [NAME], a [THEIR TITLE] at [COMPANY].<br /><br />
            Key takeaways from our conversation:<br />
            1. [INSIGHT 1]<br />
            2. [INSIGHT 2]<br />
            Action I plan to take based on their advice: [SPECIFIC ACTION]<br /><br />
            Rules:<br />
            - Show I actually listened by referencing specific advice<br />
            - Mention the action I plan to take (proves their time was valuable)<br />
            - Do NOT ask for a job in this email<br />
            - Under 100 words
          </CopyablePrompt>
        </div>

        {/* Review & Polish */}
        <h2 id="review-polish" className="text-3xl font-bold text-ink mt-12 mb-6">
          Review &amp; Polish Prompts
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Already have a draft? Use these prompts to tighten, improve, and de-AI your cover letter
          before sending.
        </p>

        <div className="space-y-6">
          <CopyablePrompt title="Prompt #25: Cover Letter Audit" bestFor="Reviewing your draft before submitting">
            Review this cover letter and provide specific feedback:<br /><br />
            [PASTE YOUR COVER LETTER]<br /><br />
            The job I am applying for: [JOB TITLE] at [COMPANY]<br /><br />
            Evaluate:<br />
            1. Does the opening grab attention or is it generic?<br />
            2. Does the letter connect my experience to their specific needs?<br />
            3. Is there anything that sounds AI-generated or overly formal?<br />
            4. Is the tone appropriate for this company and industry?<br />
            5. Is it too long? (Target: under 300 words)<br /><br />
            For each issue, provide the original text AND a suggested rewrite.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #26: De-AI Your Cover Letter" bestFor="Making AI-generated text sound human">
            Rewrite this cover letter to sound more natural and personal:<br /><br />
            [PASTE YOUR AI-GENERATED COVER LETTER]<br /><br />
            Common AI patterns to fix:<br />
            - &ldquo;I am thrilled/excited to apply&rdquo; (overused by AI)<br />
            - &ldquo;I bring a unique blend of...&rdquo; (vague)<br />
            - &ldquo;Proven track record&rdquo; (cliche)<br />
            - Overly long, compound sentences<br />
            - Generic company praise that could apply to any company<br /><br />
            Replace with conversational, specific language. Keep the same facts and structure
            but make it sound like a real person wrote it.
          </CopyablePrompt>

          <CopyablePrompt title="Prompt #27: Tone Adjustment" bestFor="Changing the formality level of your letter">
            Adjust the tone of this cover letter:<br /><br />
            [PASTE YOUR COVER LETTER]<br /><br />
            Current tone: [FORMAL / CASUAL / STIFF / TOO CASUAL]<br />
            Target tone: [PROFESSIONAL BUT WARM / FORMAL / CONVERSATIONAL / STARTUP-CASUAL]<br />
            Company culture: [e.g., &ldquo;traditional finance firm&rdquo; or &ldquo;casual tech startup&rdquo;]<br /><br />
            Adjust the vocabulary, sentence structure, and greeting/closing to match the target tone.
            Do not change the facts or achievements &mdash; only the delivery.
          </CopyablePrompt>
        </div>

        {/* Which AI */}
        <h2 id="which-ai" className="text-3xl font-bold text-ink mt-12 mb-6">
          Which AI Tool to Use for Cover Letters
        </h2>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-4 py-4 text-left font-bold text-ink">Task</th>
                <th className="px-4 py-4 text-center font-bold text-ink">Best Tool</th>
                <th className="px-4 py-4 text-left font-bold text-ink">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Full cover letter draft</td>
                <td className="px-4 py-4 text-center text-accent font-medium">Claude</td>
                <td className="px-4 py-4 text-stone-warm text-sm">Best writing quality, follows complex instructions precisely</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Company research + letter</td>
                <td className="px-4 py-4 text-center text-accent font-medium">Copilot</td>
                <td className="px-4 py-4 text-stone-warm text-sm">Web search finds recent company news to reference</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Quick iterations</td>
                <td className="px-4 py-4 text-center text-accent font-medium">ChatGPT</td>
                <td className="px-4 py-4 text-stone-warm text-sm">Fast responses, good at generating multiple versions</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Tone matching</td>
                <td className="px-4 py-4 text-center text-accent font-medium">Claude</td>
                <td className="px-4 py-4 text-stone-warm text-sm">Excellent at adjusting formality and voice</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Job description analysis</td>
                <td className="px-4 py-4 text-center text-accent font-medium">DeepSeek R1</td>
                <td className="px-4 py-4 text-stone-warm text-sm">Reasoning model catches nuances in requirements</td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Free + no sign-up</td>
                <td className="px-4 py-4 text-center text-accent font-medium">Copilot / DeepSeek</td>
                <td className="px-4 py-4 text-stone-warm text-sm">Most generous free tiers for resume/cover letter tasks</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          For model-specific prompts optimized for each tool, see our guides for{' '}
          <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">Claude</Link>,{' '}
          <Link to="/blog/copilot-resume-prompts" className="text-accent hover:underline">Copilot</Link>,{' '}
          <Link to="/blog/deepseek-resume-prompts" className="text-accent hover:underline">DeepSeek</Link>, and{' '}
          <Link to="/blog/gemini-resume-prompts" className="text-accent hover:underline">Gemini</Link>.
          For a broader overview of AI resume tools, read our{' '}
          <Link to="/blog/ai-resume-writing-guide" className="text-accent hover:underline">complete AI resume writing guide</Link>.
        </p>

        {/* Tips */}
        <h2 id="tips" className="text-3xl font-bold text-ink mt-12 mb-6">
          Tips for Better AI Cover Letters
        </h2>

        <div className="space-y-4">
          {[
            {
              num: 1,
              title: 'Give the AI your resume AND the job description',
              desc: 'The best cover letters bridge the gap between your experience and the job requirements. AI can only do this if it has both documents. Always paste both in full.',
            },
            {
              num: 2,
              title: 'Include one genuine, specific reason you want THIS job',
              desc: 'A real detail about the company (a product you use, a value you share, a team member you admire) produces better output than "I am excited about this opportunity."',
            },
            {
              num: 3,
              title: 'Set explicit constraints',
              desc: '"Under 300 words," "3 paragraphs max," "do not start with I am writing to apply" — constraints produce tighter output. Without them, AI writes too long and too generic.',
            },
            {
              num: 4,
              title: 'Generate 2-3 versions and combine the best parts',
              desc: 'Run the same prompt 2-3 times or ask for multiple versions. Pick the best opening from one, the best value paragraph from another, and the best closing from a third.',
            },
            {
              num: 5,
              title: 'Always edit before sending',
              desc: 'AI gives you a strong first draft. Your job is to add your voice, verify all facts, remove anything that sounds generic, and make sure it reads like YOU wrote it. A hiring manager should not be able to tell AI was involved.',
            },
          ].map((tip) => (
            <div key={tip.num} className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-accent text-ink rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {tip.num}
              </div>
              <div>
                <h3 className="font-bold text-ink mb-1">{tip.title}</h3>
                <p className="text-stone-warm">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: 'Is it okay to use AI for cover letters?',
              a: 'Yes. AI is a tool, like spell check or a thesaurus. The key is using it as a starting point, not submitting raw AI output. Edit for accuracy, add personal details, and make sure the final version sounds like you. Hiring managers care about the quality of the letter, not whether you used AI to draft it.',
            },
            {
              q: 'Can employers detect AI-written cover letters?',
              a: 'Unedited AI output has tells: generic praise, overly formal language, phrases like "I am thrilled to apply." But a well-edited letter that uses AI as a starting point is indistinguishable from one written entirely by hand. Use prompts #25-27 above to polish your draft.',
            },
            {
              q: 'Should I write a cover letter if it says "optional"?',
              a: '"Optional" usually means "we will read it if you send one." A strong cover letter differentiates you from candidates who skipped it. If you are serious about the role, write one. AI makes it fast enough that there is no reason not to.',
            },
            {
              q: 'How long should an AI-generated cover letter be?',
              a: '250-300 words, or roughly 3 paragraphs. Most AI tools write too long by default, which is why every prompt above includes a word limit. Shorter is almost always better — hiring managers skim, they do not read word by word.',
            },
            {
              q: 'Which AI tool writes the best cover letters?',
              a: 'Claude produces the most natural-sounding writing. ChatGPT is fastest for iterations. Copilot is best when you need company research built into the letter. See the comparison table above for a task-by-task breakdown.',
            },
            {
              q: 'How do I pair an AI cover letter with my resume?',
              a: 'Use AI to write your cover letter, then format your resume with a professional builder. Our free resume builder at EasyFreeResume creates ATS-friendly resumes that complement a strong cover letter — no sign-up or payment required.',
            },
          ].map((faq, i) => (
            <div key={i} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
              <p className="text-stone-warm">{faq.a}</p>
            </div>
          ))}
        </div>

      </div>
    </BlogLayout>
  );
}
