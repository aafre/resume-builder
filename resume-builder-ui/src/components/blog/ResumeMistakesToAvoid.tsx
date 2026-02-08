import BlogLayout from '../BlogLayout';

export default function ResumeMistakesToAvoid() {
  return (
    <BlogLayout
      title="10 Critical Resume Mistakes That Kill Your Job Prospects"
      description="Discover the most common resume errors that send your application straight to the rejection pile and learn how to avoid them."
      publishDate="2026-01-25"
      readTime="7 min"
      keywords={['resume mistakes', 'job application tips', 'resume writing', 'career advice', 'job search']}
      ctaType="resume"
    >
      <div className="space-y-8">
        <p className="text-xl leading-relaxed text-gray-700 font-medium">
          Updated for 2026: Your resume is your first impression with potential employers. A single mistake can mean the difference between landing an interview and having your application dismissed. After reviewing thousands of resumes, we've identified the most critical errors that consistently hurt job seekers' chances.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-800 mb-2">⚠️ Critical Stat</h3>
          <p className="text-red-700">
            Recruiters spend an average of just 6-8 seconds scanning a resume initially. These common mistakes can eliminate you in those crucial first moments.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">1. Typos and Grammatical Errors</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Nothing kills credibility faster than spelling mistakes or poor grammar. These errors signal carelessness and lack of attention to detail – qualities no employer wants in their team.
        </p>
        <div className="bg-gray-50 border-l-4 border-accent p-6 my-6">
          <h4 className="font-bold text-gray-900 mb-2">Quick Fix:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Use spell-check tools like Grammarly or Hemingway Editor</li>
            <li>Read your resume aloud to catch awkward phrasing</li>
            <li>Have a friend or family member proofread it</li>
            <li>Take a break and review with fresh eyes</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">2. Generic, One-Size-Fits-All Resumes</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Sending the same resume to every job posting is like using a master key that opens no doors. Modern hiring requires customization to match specific job requirements and company culture.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-green-800 mb-3">✅ Best Practice:</h4>
          <p className="text-green-700 mb-3">
            Tailor your resume for each application by:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-green-700">
            <li>Matching keywords from the job description</li>
            <li>Highlighting relevant experience for the specific role</li>
            <li>Adjusting your professional summary for the target position</li>
            <li>Reordering bullet points to emphasize most relevant achievements</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">3. Weak or Missing Professional Summary</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Your professional summary is prime real estate – the first thing recruiters read. A weak summary like "Hard-working professional seeking opportunities" wastes this valuable space.
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-3">❌ Poor Example:</h4>
            <p className="text-red-700 italic">
              "Hard-working professional with experience in marketing looking for new opportunities to grow my career."
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-3">✅ Strong Example:</h4>
            <p className="text-green-700 italic">
              "Results-driven digital marketing specialist with 5+ years driving 200%+ ROI growth for B2B SaaS companies. Expert in SEO, PPC, and marketing automation with proven track record of increasing qualified leads by 150%."
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">4. Listing Job Duties Instead of Achievements</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Employers know what your job title entails. They want to see what you accomplished in that role. Focus on specific, quantifiable achievements rather than generic responsibilities.
        </p>
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-3">The Achievement Formula:</h4>
          <p className="text-ink/80 font-medium text-lg mb-3">
            Action Verb + Specific Task + Quantifiable Result
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-red-700 font-medium">❌ Weak: "Responsible for managing social media accounts"</p>
              <p className="text-green-700 font-medium">✅ Strong: "Managed 5 social media accounts, increasing engagement by 85% and driving 300+ monthly website visits"</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">5. Poor Formatting and Design</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          A cluttered, hard-to-read resume creates a poor first impression. Clean, professional formatting helps recruiters quickly find the information they need.
        </p>
        <div className="bg-gray-50 border-l-4 border-accent p-6 my-6">
          <h4 className="font-bold text-gray-900 mb-2">Formatting Best Practices:</h4>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Use consistent fonts (stick to 1-2 font families)</li>
            <li>Maintain proper white space and margins</li>
            <li>Use bullet points for easy scanning</li>
            <li>Keep formatting simple and professional</li>
            <li>Ensure your resume looks good both printed and on-screen</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">6. Including Irrelevant Personal Information</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Your resume should focus on professional qualifications. Personal details like age, marital status, religious beliefs, or hobbies (unless job-relevant) take up valuable space and can introduce unconscious bias.
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h4 className="font-bold text-red-800 mb-3">❌ Avoid Including:</h4>
            <ul className="list-disc pl-6 space-y-1 text-red-700">
              <li>Age or date of birth</li>
              <li>Marital status</li>
              <li>Physical description</li>
              <li>Social security number</li>
              <li>Personal photo (unless required)</li>
              <li>Irrelevant hobbies</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-3">✅ Do Include:</h4>
            <ul className="list-disc pl-6 space-y-1 text-green-700">
              <li>Professional email address</li>
              <li>LinkedIn profile URL</li>
              <li>City and state (no full address needed)</li>
              <li>Portfolio website</li>
              <li>Relevant certifications</li>
              <li>Job-relevant skills</li>
            </ul>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">7. Using an Unprofessional Email Address</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Your email address is often the first thing recruiters see. Addresses like "partyboy123@email.com" or "sexykitten@email.com" immediately undermine your professionalism.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-yellow-800 mb-3">📧 Email Best Practices:</h4>
          <ul className="list-disc pl-6 space-y-2 text-yellow-700">
            <li>Use your first and last name when possible: john.smith@email.com</li>
            <li>If that's taken, add numbers: john.smith2024@email.com</li>
            <li>Stick to popular email providers (Gmail, Outlook, Yahoo)</li>
            <li>Avoid outdated providers or ISP emails</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">8. Excessive Length or Too Brief</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Resume length should match your experience level. New graduates cramming onto one page often omit important details, while experienced professionals sometimes include every job since high school.
        </p>
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-3">📏 Length Guidelines:</h4>
          <ul className="list-disc pl-6 space-y-2 text-ink/80">
            <li><strong>0-5 years experience:</strong> 1 page ideal</li>
            <li><strong>5-15 years experience:</strong> 1-2 pages</li>
            <li><strong>15+ years experience:</strong> 2-3 pages maximum</li>
            <li><strong>Academic/Research roles:</strong> CV format may be longer</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">9. Neglecting ATS Optimization</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Over 98% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter resumes. If your resume isn't ATS-friendly, it may never reach human eyes, regardless of your qualifications.
        </p>
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <h4 className="font-bold text-ink mb-3">🤖 ATS Optimization Tips:</h4>
          <ul className="list-disc pl-6 space-y-2 text-ink/80">
            <li>Use standard section headings (Experience, Education, Skills)</li>
            <li>Include keywords from the job description</li>
            <li>Avoid images, graphics, and complex formatting</li>
            <li>Use standard fonts and bullet points</li>
            <li>Save as both PDF and Word document formats</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">10. Outdated or Missing Contact Information</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          It sounds basic, but you'd be surprised how often great candidates are unreachable due to outdated contact information or missing LinkedIn profiles.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <h4 className="font-bold text-green-800 mb-3">📞 Contact Info Checklist:</h4>
          <ul className="list-disc pl-6 space-y-2 text-green-700">
            <li>Current phone number with professional voicemail</li>
            <li>Professional email address you check regularly</li>
            <li>Updated LinkedIn profile URL</li>
            <li>City and state (remote work preferences if applicable)</li>
            <li>Portfolio website or GitHub (for relevant roles)</li>
          </ul>
        </div>

        <div className="bg-ink text-white rounded-xl p-8 my-12">
          <h3 className="text-2xl font-bold mb-4">🎯 Action Plan: Fix Your Resume Today</h3>
          <ol className="list-decimal pl-6 space-y-3 text-lg">
            <li>Print your current resume and review for these 10 mistakes</li>
            <li>Use our free resume builder to create an ATS-optimized version</li>
            <li>Customize your resume for each specific job application</li>
            <li>Have someone else proofread for errors</li>
            <li>Test your resume through an ATS checker tool</li>
          </ol>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Bottom Line</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Your resume is a marketing document designed to get you interviews, not jobs. Every word, format choice, and section should work toward that goal. By avoiding these common mistakes, you'll create a resume that stands out for the right reasons and gets you in front of hiring managers.
        </p>

        <p className="text-lg leading-relaxed text-gray-700 mt-6">
          Remember: even small improvements can have big impacts. A single typo fix or better formatting can be the difference between your resume being discarded or moving to the interview pile.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mt-8">
          <h4 className="font-bold text-yellow-800 mb-3">💡 Pro Tip</h4>
          <p className="text-yellow-700">
            Keep a master resume with all your experiences and achievements, then create tailored versions for specific applications. This approach saves time while ensuring relevance for each opportunity.
          </p>
        </div>
      </div>
    </BlogLayout>
  );
}