import { describe, it, expect } from 'vitest';
import { extractKeywords, scanResume } from '../keywordMatcher';

// ---------------------------------------------------------------------------
// 1. extractKeywords — Basic Extraction
// ---------------------------------------------------------------------------
describe('extractKeywords', () => {
  describe('basic extraction', () => {
    it('extracts technical single words appearing 2+ times', () => {
      const jd = 'We use python and react. Strong python skills. Experience with react and sql. Must know sql.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('python');
      expect(kw).toContain('react');
      expect(kw).toContain('sql');
    });

    it('extracts multi-word phrases appearing 2+ times', () => {
      const jd =
        'Experience with project management is key. ' +
        'Project management certification preferred. ' +
        'Data analysis using project management tools. ' +
        'Data analysis skills required.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('project management');
      expect(kw).toContain('data analysis');
    });

    it('returns an array', () => {
      const kw = extractKeywords('Some job description about python and react.');
      expect(Array.isArray(kw)).toBe(true);
    });

    it('respects 40-keyword cap', () => {
      // Repeat many distinct words 3+ times to push past 40
      const words = Array.from({ length: 60 }, (_, i) => `techword${i}`);
      const jd = words.map((w) => `${w} ${w} ${w}`).join('. ');
      const kw = extractKeywords(jd);
      expect(kw.length).toBeLessThanOrEqual(40);
    });

    it('returns keywords sorted by frequency (higher first)', () => {
      const jd =
        'python python python python. javascript javascript. typescript typescript typescript.';
      const kw = extractKeywords(jd);
      const pyIdx = kw.indexOf('python');
      const jsIdx = kw.indexOf('javascript');
      const tsIdx = kw.indexOf('typescript');
      expect(pyIdx).toBeLessThan(jsIdx);
      expect(tsIdx).toBeLessThan(jsIdx);
    });

    it('handles short one-sentence JD', () => {
      const kw = extractKeywords('We need a python developer with react experience and python skills.');
      expect(kw).toContain('python');
    });
  });

  // ---------------------------------------------------------------------------
  // 2. extractKeywords — Noise Filtering
  // ---------------------------------------------------------------------------
  describe('noise filtering', () => {
    it('filters out stop words', () => {
      const jd = 'the the the. and and and. with with with. is is is.';
      const kw = extractKeywords(jd);
      expect(kw).not.toContain('the');
      expect(kw).not.toContain('and');
      expect(kw).not.toContain('with');
      expect(kw).not.toContain('is');
    });

    it('filters out job filler words', () => {
      const jd =
        'Experience required. Candidate preferred. ' +
        'Ability and position. Responsibilities and experience. ' +
        'Required candidate ability position responsibilities.';
      const kw = extractKeywords(jd);
      expect(kw).not.toContain('experience');
      expect(kw).not.toContain('required');
      expect(kw).not.toContain('candidate');
      expect(kw).not.toContain('ability');
      expect(kw).not.toContain('position');
      expect(kw).not.toContain('responsibilities');
    });

    it('filters out recruiter language', () => {
      const jd =
        'Looking for someone with strong knowledge. ' +
        'Excellent proven ideal candidate. ' +
        'Looking strong excellent knowledge ideal proven.';
      const kw = extractKeywords(jd);
      expect(kw).not.toContain('looking');
      expect(kw).not.toContain('strong');
      expect(kw).not.toContain('excellent');
      expect(kw).not.toContain('knowledge');
      expect(kw).not.toContain('ideal');
      expect(kw).not.toContain('proven');
    });

    it('filters out connector-word bigrams', () => {
      const jd =
        'Experience with python. Experience with react. ' +
        'Javascript and backend. Javascript and frontend.';
      const kw = extractKeywords(jd);
      expect(kw).not.toContain('experience with');
      expect(kw).not.toContain('javascript and');
    });

    it('filters single-occurrence bigrams', () => {
      const jd = 'Cloud computing is great. Python python python.';
      const kw = extractKeywords(jd);
      expect(kw).not.toContain('cloud computing');
    });

    it('keeps bigrams appearing 2+ times', () => {
      const jd =
        'Machine learning is important. We invest in machine learning heavily. ' +
        'Our machine learning team is growing.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('machine learning');
    });

    it('filters out benefits noise', () => {
      const jd =
        'Health insurance provided. 401k matching. Dental and vision. PTO and remote. ' +
        'Health dental vision insurance 401k pto remote.';
      const kw = extractKeywords(jd);
      expect(kw).not.toContain('health');
      expect(kw).not.toContain('insurance');
      expect(kw).not.toContain('401k');
      expect(kw).not.toContain('dental');
      expect(kw).not.toContain('pto');
    });

    it('filters generic verbs', () => {
      const jd =
        'Implement solutions. Develop features. Manage projects. Support users. ' +
        'Implement develop manage support implement develop manage support.';
      const kw = extractKeywords(jd);
      expect(kw).not.toContain('implement');
      expect(kw).not.toContain('develop');
      expect(kw).not.toContain('manage');
      expect(kw).not.toContain('support');
    });
  });

  // ---------------------------------------------------------------------------
  // 3. extractKeywords — Special Characters
  // ---------------------------------------------------------------------------
  describe('special characters', () => {
    it('extracts C++ correctly', () => {
      const jd = 'Must know C++. Experience with C++ required. C++ performance.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('c++');
    });

    it('extracts C# correctly', () => {
      const jd = 'We use C# for backend. C# and .NET experience. C# is primary.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('c#');
    });

    it('extracts .NET and ASP.NET correctly', () => {
      const jd =
        'Build with .NET framework. ASP.NET web applications. ' +
        '.NET core experience. ASP.NET MVC patterns.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('.net');
      expect(kw).toContain('asp.net');
    });

    it('extracts node.js and vue.js correctly', () => {
      const jd =
        'Node.js backend services. Vue.js frontend. ' +
        'Node.js microservices. Vue.js components.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('node.js');
      expect(kw).toContain('vue.js');
    });

    it('preserves CI/CD', () => {
      const jd = 'CI/CD pipelines. Automated CI/CD workflows. CI/CD integration.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('ci/cd');
    });

    it('extracts multiple special-char terms from one JD', () => {
      // Each term in its own sentence context to avoid unintended bigrams
      const jd =
        'Must know C++ for systems programming. C++ is essential. ' +
        'Backend services in C# are required. C# applications. ' +
        'The .NET framework is our platform. Build on .NET core. ' +
        'Node.js powers our APIs. We run node.js in production.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('c++');
      expect(kw).toContain('c#');
      expect(kw).toContain('.net');
      expect(kw).toContain('node.js');
    });
  });

  // ---------------------------------------------------------------------------
  // 4. extractKeywords — Requirements Section Detection
  // ---------------------------------------------------------------------------
  describe('requirements section detection', () => {
    const companyBlurb =
      'Acme Corp is a leading innovator in fintech. ' +
      'We are disrupting payments with cutting-edge blockchain solutions. ' +
      'Our culture values creativity and teamwork.';

    it('uses text after "Requirements:" header, skips company blurb', () => {
      const jd = `${companyBlurb}\n\nRequirements:\n- Python experience\n- Python scripting\n- Django framework\n- Django applications`;
      const kw = extractKeywords(jd);
      expect(kw).toContain('python');
      expect(kw).toContain('django');
      // "blockchain" from blurb should not appear (only 1 occurrence in blurb, requirements section used)
      expect(kw).not.toContain('blockchain');
    });

    it('recognizes "Qualifications:" as header', () => {
      const jd = `${companyBlurb}\n\nQualifications:\n- Proficiency in React for building UIs. React components. React hooks.\n- Experience with GraphQL APIs. GraphQL queries.`;
      const kw = extractKeywords(jd);
      expect(kw).toContain('react');
    });

    it('recognizes "What you\'ll need:" as header', () => {
      const jd = `${companyBlurb}\n\nWhat you'll need:\n- Kubernetes for container orchestration. Kubernetes clusters. Kubernetes deployments.\n- Terraform for IaC. Terraform modules.`;
      const kw = extractKeywords(jd);
      expect(kw).toContain('kubernetes');
    });

    it('recognizes "Responsibilities:" as header', () => {
      const jd = `${companyBlurb}\n\nResponsibilities:\n- Build APIs with golang. Golang microservices. Golang services.`;
      const kw = extractKeywords(jd);
      expect(kw).toContain('golang');
    });

    it('uses full text when no header present (graceful fallback)', () => {
      const jd =
        'We need python developers. Python is essential. ' +
        'Also experience with react. React frontend needed.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('python');
      expect(kw).toContain('react');
    });
  });

  // ---------------------------------------------------------------------------
  // 5. extractKeywords — Subsumption
  // ---------------------------------------------------------------------------
  describe('subsumption', () => {
    it('removes standalone "machine" and "learning" when "machine learning" is present', () => {
      const jd =
        'Machine learning is critical. We need machine learning expertise. ' +
        'Deep machine learning models. Machine learning pipelines.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('machine learning');
      expect(kw).not.toContain('machine');
      expect(kw).not.toContain('learning');
    });

    it('removes standalone "data" and "science" when "data science" is present', () => {
      const jd =
        'Data science team. Data science projects. Data science models. Data science leadership.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('data science');
      expect(kw).not.toContain('data');
      expect(kw).not.toContain('science');
    });

    it('removes high-frequency singles if they appear in a bigram (bidirectional)', () => {
      // "deep" has higher count than "deep learning" but pass B still removes it
      // because bidirectional subsumption is unconditional on frequency
      const jd =
        'Deep learning techniques. Deep learning models. ' +
        'Deep neural networks. Deep architectures. Deep optimization.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('deep learning');
      expect(kw).not.toContain('deep');
    });

    it('keeps singles NOT in any bigram', () => {
      // Each keyword in its own sentence so they never form bigrams with each other
      const jd =
        'We use python heavily. Love python scripting. ' +
        'Also need django expertise. Django is essential. ' +
        'Must know kubernetes too. Kubernetes clusters required.';
      const kw = extractKeywords(jd);
      expect(kw).toContain('python');
      expect(kw).toContain('django');
      expect(kw).toContain('kubernetes');
    });
  });

  // ---------------------------------------------------------------------------
  // 6. extractKeywords — Edge Cases
  // ---------------------------------------------------------------------------
  describe('edge cases', () => {
    it('returns empty array for empty string', () => {
      expect(extractKeywords('')).toEqual([]);
    });

    it('returns empty array for whitespace-only input', () => {
      expect(extractKeywords('   \n\t  ')).toEqual([]);
    });

    it('returns empty array for only stop words', () => {
      const kw = extractKeywords('the and is are was with for to of in on at');
      expect(kw).toEqual([]);
    });

    it('returns empty array for only job filler', () => {
      const kw = extractKeywords(
        'experience required preferred ability skills candidate position role'
      );
      expect(kw).toEqual([]);
    });

    it('handles excessive punctuation', () => {
      const jd = '!!!Python!!! ???React??? ...Python... ===React===';
      const kw = extractKeywords(jd);
      expect(kw).toContain('python');
      expect(kw).toContain('react');
    });

    it('handles input with no punctuation', () => {
      // Use stop words as separators — they get filtered so no bigram subsumption
      const jd = 'python is great and python is awesome and react is good and react is fun';
      const kw = extractKeywords(jd);
      expect(kw).toContain('python');
      expect(kw).toContain('react');
    });
  });
});

// ===========================================================================
// scanResume
// ===========================================================================
describe('scanResume', () => {
  // ---------------------------------------------------------------------------
  // 7. scanResume — Match Scoring
  // ---------------------------------------------------------------------------
  describe('match scoring', () => {
    // Compact JD: each keyword appears 2× to pass frequency gate
    const sampleJD =
      'Python backend. React frontend. TypeScript codebase. SQL databases. ' +
      'Docker containers. Kubernetes orchestration. AWS cloud. Git workflows. ' +
      'Must know python and react. TypeScript and SQL required. Docker and kubernetes. AWS and git.';

    it('returns high score for resume that matches most JD keywords', () => {
      const resume =
        'Expert in python, react, typescript, and sql. ' +
        'Built python microservices. React single page apps. TypeScript throughout. SQL queries. ' +
        'Docker deployments. Kubernetes clusters. AWS infrastructure. Git workflows. ' +
        'Docker containers. Kubernetes orchestration. AWS cloud services. Git version control.';
      const result = scanResume(resume, sampleJD);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(70);
    });

    it('returns low score for completely unrelated resume', () => {
      const resume =
        'Experienced barista with 5 years in food service. Made espresso drinks. ' +
        'Customer service and cash register. Cleaned equipment. Opening and closing duties.';
      const result = scanResume(resume, sampleJD);
      expect(result.matchPercentage).toBeLessThanOrEqual(10);
    });

    it('returns proportional score for partial match', () => {
      const resume =
        'I know python and react. Python backend work. React frontend. ' +
        'No docker or kubernetes experience.';
      const result = scanResume(resume, sampleJD);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(20);
      expect(result.matchPercentage).toBeLessThanOrEqual(80);
    });

    it('returns 0% for empty resume', () => {
      const result = scanResume('', sampleJD);
      expect(result.matchPercentage).toBe(0);
    });

    it('returns 0 keywords and 0% for empty JD', () => {
      const result = scanResume('Some resume text with python and react.', '');
      expect(result.totalKeywords).toBe(0);
      expect(result.matchPercentage).toBe(0);
    });

    it('has matchedCount + missingCount = totalKeywords', () => {
      const resume = 'Python developer with react and sql experience. Python react sql.';
      const result = scanResume(resume, sampleJD);
      expect(result.matchedCount + result.missingCount).toBe(result.totalKeywords);
    });

    it('returns correct ScanResult structure', () => {
      const result = scanResume('Python developer.', 'Python required. Python skills.');
      expect(result).toHaveProperty('matchPercentage');
      expect(result).toHaveProperty('totalKeywords');
      expect(result).toHaveProperty('matchedCount');
      expect(result).toHaveProperty('missingCount');
      expect(result).toHaveProperty('matched');
      expect(result).toHaveProperty('missing');
      expect(Array.isArray(result.matched)).toBe(true);
      expect(Array.isArray(result.missing)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // 8. scanResume — Real-World Scenarios ⭐ MOST CRITICAL
  // ---------------------------------------------------------------------------
  describe('real-world scenarios', () => {
    it('a) SWE resume vs SWE JD — high match', () => {
      const jd = `
        Software Engineer
        Requirements:
        - JavaScript and TypeScript for web apps. JavaScript frontend. TypeScript backend.
        - React components and hooks. React UI development.
        - Node.js services and APIs. Node.js microservices.
        - REST APIs for data exchange. REST API design.
        - CI/CD pipeline automation. CI/CD for deployments.
        - Git version control. Git branching.
        - Agile methodology. Agile sprints. Scrum ceremonies.
      `;
      const resume = `
        Full Stack Software Engineer with 5 years of experience.
        - Built web apps using JavaScript and TypeScript
        - Created React components and hooks for frontend
        - Developed REST APIs and microservices with Node.js
        - Implemented CI/CD pipelines using GitHub Actions
        - Managed code with Git, branching and code reviews
        - Worked in agile teams following scrum methodology
      `;
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(55);
    });

    it('b) PM resume vs PM JD — high match', () => {
      const jd = `
        Product Manager
        Requirements:
        - Own and define the product roadmap. Product roadmap planning.
        - Run A/B testing experiments. A/B testing analysis.
        - JIRA for sprint tracking. JIRA workflows.
        - Stakeholder presentations. Stakeholder alignment.
        - Agile practices. Scrum methodology. Agile scrum.
      `;
      const resume = `
        Product Manager with 4 years of experience.
        - Built and maintained product roadmap for analytics platform
        - Led A/B testing initiatives improving conversion by 25%
        - Managed sprints and workflows in JIRA
        - Presented strategy to executive stakeholders quarterly
        - Scrum Product Owner, applied agile practices
      `;
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(35);
    });

    it('c) Nursing resume vs ICU JD — high match', () => {
      const jd = `
        ICU Registered Nurse
        Qualifications:
        - RN license required. Active RN.
        - BSN degree. BSN from accredited school.
        - ACLS certified. Current ACLS.
        - BLS certified. Current BLS.
        - Ventilator management. Ventilator weaning.
        - EHR charting. EHR documentation.
        - CCRN preferred. CCRN eligible.
      `;
      const resume = `
        Registered Nurse (RN) with BSN, 6 years in ICU.
        - Maintained ACLS and BLS certifications
        - Managed ventilator settings and weaning
        - Documented care in EHR (Epic) system
        - Earned CCRN certification in 2023
      `;
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(35);
    });

    it('d) Barista resume vs Backend SWE JD — very low match', () => {
      const jd = `
        Backend Software Engineer
        Requirements:
        - Expert in Python for backend. Python scripting.
        - SQL database design. SQL queries.
        - Docker containerization. Docker images.
        - Kubernetes orchestration. Kubernetes clusters.
        - AWS cloud services. AWS infrastructure.
        - Microservices architecture. Microservices design.
      `;
      const resume = `
        Barista and Shift Supervisor at Starbucks for 3 years.
        - Prepared espresso-based beverages and maintained quality standards
        - Trained 12 new team members on drink preparation and POS systems
        - Handled cash register operations and daily reconciliation
        - Maintained cleanliness standards and equipment maintenance
        - Provided excellent customer service to 200+ customers daily
      `;
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBeLessThanOrEqual(15);
    });

    it('e) C++/C#/.NET resume vs matching JD — verifies special chars in matched', () => {
      const jd = `
        Systems Developer
        Requirements:
        - C++ programming. Modern C++ standards.
        - C# backend services. C# applications.
        - ASP.NET web services. ASP.NET APIs.
        - .NET framework. .NET core platform.
        - Visual Studio IDE. Visual Studio debugging.
      `;
      const resume = `
        Systems Developer with 7 years of experience.
        - Developed high-performance C++ applications
        - Built enterprise services using C# and ASP.NET
        - Extensive experience with .NET framework and .NET Core
        - Primary IDE: Visual Studio with extensions
        - Optimized real-time C++ systems for trading
      `;
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(50);
      const matchedKeywords = result.matched.map((m) => m.keyword);
      const hasSpecialChar = matchedKeywords.some(
        (k) => k === 'c++' || k === 'c#' || k === '.net' || k === 'asp.net'
      );
      expect(hasSpecialChar).toBe(true);
    });

    it('f) Data Science resume vs DS JD — high match', () => {
      const jd = `
        Data Scientist
        Requirements:
        - Machine learning models. Machine learning pipelines.
        - Deep learning architectures. Deep learning training.
        - TensorFlow for model serving. TensorFlow experience.
        - PyTorch for research. PyTorch training.
        - Apache Spark clusters. Spark data processing.
      `;
      const resume = `
        Data Scientist with 5 years of experience.
        - Built machine learning models for recommendations
        - Implemented deep learning architectures for NLP
        - Used TensorFlow and PyTorch for training and deployment
        - Processed data using Apache Spark clusters
        - Published research on deep learning techniques
      `;
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(65);
    });

    it('g) DevOps resume vs DevOps JD — high match', () => {
      const jd = `
        DevOps Engineer
        Requirements:
        - CI/CD pipeline setup. CI/CD automation.
        - AWS cloud services. AWS infrastructure.
        - Terraform configurations. Terraform modules.
        - Docker containers. Docker images.
        - Kubernetes clusters. Kubernetes deployments.
        - Jenkins builds. Jenkins automation.
        - Linux servers. Linux administration.
      `;
      const resume = `
        DevOps Engineer with 6 years of experience.
        - Built CI/CD pipelines with Jenkins and GitHub Actions
        - Managed AWS infrastructure across production environments
        - Wrote Terraform modules and configurations
        - Containerized services with Docker images
        - Orchestrated Kubernetes clusters and deployments
        - Automated Jenkins builds and deployment pipelines
        - Administered Linux servers in production
      `;
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBeGreaterThanOrEqual(65);
    });
  });

  // ---------------------------------------------------------------------------
  // 9. scanResume — Placement Suggestions
  // ---------------------------------------------------------------------------
  describe('placement suggestions', () => {
    // Helper: get suggestedPlacement for a keyword from missing results
    function getMissingSuggestion(keyword: string, jd: string): string | undefined {
      // Use an empty resume so everything is missing
      const result = scanResume('', jd);
      const item = result.missing.find((m) => m.keyword === keyword);
      return item?.suggestedPlacement;
    }

    it('suggests "Skills section — Technical Skills" for programming languages', () => {
      const placement = getMissingSuggestion('python', 'Python developer. Python code. Python scripts.');
      expect(placement).toBe('Skills section — Technical Skills');
    });

    it('suggests "Skills section — Frameworks" for frameworks', () => {
      const placement = getMissingSuggestion('react', 'React developer. React apps. React components.');
      expect(placement).toBe('Skills section — Frameworks');
    });

    it('suggests "Skills section — Tools & Infrastructure" for cloud/infra', () => {
      const placement = getMissingSuggestion('docker', 'Docker containers. Docker deployment. Docker images.');
      expect(placement).toBe('Skills section — Tools & Infrastructure');
    });

    it('suggests "Certifications section" for certifications', () => {
      const placement = getMissingSuggestion('pmp', 'PMP certified. PMP certification. PMP credential.');
      expect(placement).toContain('Certifications');
    });

    it('suggests "Experience section" for action verbs', () => {
      const placement = getMissingSuggestion('managed', 'Managed teams. Managed projects. Managed budgets.');
      expect(placement).toContain('Experience section');
    });

    it('suggests "Skills section — Methodologies" for methodologies', () => {
      const placement = getMissingSuggestion('agile', 'Agile development. Agile methodology. Agile teams.');
      expect(placement).toBe('Skills section — Methodologies');
    });

    it('suggests generic fallback for unknown terms', () => {
      const placement = getMissingSuggestion(
        'fintech',
        'Fintech solutions. Fintech products. Fintech innovation.'
      );
      expect(placement).toBe('Skills section or Experience bullet points');
    });
  });

  // ---------------------------------------------------------------------------
  // 10. scanResume — Case Insensitivity
  // ---------------------------------------------------------------------------
  describe('case insensitivity', () => {
    it('"Python" in JD matches "python" in resume', () => {
      const jd = 'Python required. Python skills. Python experience.';
      const result = scanResume('I know python very well. python scripting.', jd);
      const matched = result.matched.map((m) => m.keyword);
      expect(matched).toContain('python');
    });

    it('"AWS" in JD matches "aws" in resume', () => {
      const jd = 'AWS cloud. AWS infrastructure. AWS services.';
      const result = scanResume('Experience with aws cloud services. aws deployments.', jd);
      expect(result.matched.map((m) => m.keyword)).toContain('aws');
    });

    it('"JavaScript" in JD matches "JAVASCRIPT" in resume', () => {
      const jd = 'JavaScript required. JavaScript skills. JavaScript experience.';
      const result = scanResume('Expert in JAVASCRIPT development. JAVASCRIPT frameworks.', jd);
      expect(result.matched.map((m) => m.keyword)).toContain('javascript');
    });

    it('bigrams match case-insensitively', () => {
      const jd =
        'Machine Learning expertise. Machine Learning models. Machine Learning pipelines.';
      const result = scanResume(
        'Built MACHINE LEARNING systems for production. machine learning research.',
        jd
      );
      expect(result.matched.map((m) => m.keyword)).toContain('machine learning');
    });

    it('mixed case terms match (PostgreSQL, mongoDB)', () => {
      const jd = 'PostgreSQL database. PostgreSQL experience. PostgreSQL queries.';
      const result = scanResume('Worked with postgresql and POSTGRESQL databases.', jd);
      expect(result.matched.map((m) => m.keyword)).toContain('postgresql');
    });
  });

  // ---------------------------------------------------------------------------
  // 11. Word Boundaries (countOccurrences via scanResume)
  // ---------------------------------------------------------------------------
  describe('word boundaries', () => {
    it('"data" does NOT match "database"', () => {
      const jd = 'Data analysis required. Data pipelines. Data engineering.';
      // Resume has "database" but not standalone "data"
      const result = scanResume('Managed database systems. Built database schemas.', jd);
      const dataResult = result.matched.find((m) => m.keyword === 'data');
      // "data" should not be found via "database" substring
      expect(dataResult).toBeUndefined();
    });

    it('"data" does NOT match "updated"', () => {
      const jd = 'Data skills required. Data processing. Data visualization.';
      const result = scanResume('Updated all systems. Updated records regularly.', jd);
      const dataResult = result.matched.find((m) => m.keyword === 'data');
      expect(dataResult).toBeUndefined();
    });

    it('counts multiple occurrences correctly', () => {
      const jd = 'Python required. Python skills.';
      const resume = 'I use python daily. Built python apps. Love python programming.';
      const result = scanResume(resume, jd);
      const pythonMatch = result.matched.find((m) => m.keyword === 'python');
      expect(pythonMatch).toBeDefined();
      expect(pythonMatch!.count).toBe(3);
    });

    it('counts special char keyword occurrences correctly (c++)', () => {
      const jd = 'C++ required. C++ skills. C++ performance.';
      const resume = 'Expert in C++ programming. Built C++ libraries.';
      const result = scanResume(resume, jd);
      const cppMatch = result.matched.find((m) => m.keyword === 'c++');
      expect(cppMatch).toBeDefined();
      expect(cppMatch!.count).toBe(2);
    });

    it('matches keywords at start and end of text', () => {
      const jd = 'Python skills. Python experience.';
      const resume = 'python is my main language and I also teach python';
      const result = scanResume(resume, jd);
      const pythonMatch = result.matched.find((m) => m.keyword === 'python');
      expect(pythonMatch).toBeDefined();
      expect(pythonMatch!.count).toBe(2);
    });

    it('counts bigram occurrences correctly', () => {
      const jd =
        'Machine learning required. Machine learning experience. Machine learning models.';
      const resume =
        'Built machine learning pipelines. Applied machine learning to NLP. Studied machine learning theory.';
      const result = scanResume(resume, jd);
      const mlMatch = result.matched.find((m) => m.keyword === 'machine learning');
      expect(mlMatch).toBeDefined();
      expect(mlMatch!.count).toBe(3);
    });
  });

  // ---------------------------------------------------------------------------
  // 12. Integration — Complete Workflows
  // ---------------------------------------------------------------------------
  describe('integration', () => {
    it('matched keywords sorted by count descending', () => {
      const jd =
        'Python and react and golang. Python react golang. Python react golang.';
      const resume =
        'Python python python python. React react react. Golang golang.';
      const result = scanResume(resume, jd);
      for (let i = 1; i < result.matched.length; i++) {
        expect(result.matched[i - 1].count).toBeGreaterThanOrEqual(result.matched[i].count);
      }
    });

    it('zero-match resume returns empty matched array, full missing array', () => {
      const jd = 'Python and react required. Python and react skills.';
      const resume = 'Experienced barista and cashier with food handling certification.';
      const result = scanResume(resume, jd);
      expect(result.matched.length).toBe(0);
      expect(result.missing.length).toBe(result.totalKeywords);
    });

    it('100%-match resume returns full matched array, empty missing array', () => {
      const jd = 'Python required. React needed. Python and react.';
      const keywords = extractKeywords(jd);
      // Build a resume that contains every extracted keyword multiple times
      const resume = keywords.map((k) => `${k} ${k} ${k}`).join('. ');
      const result = scanResume(resume, jd);
      expect(result.matchPercentage).toBe(100);
      expect(result.missing.length).toBe(0);
      expect(result.matched.length).toBe(result.totalKeywords);
    });

    it('handles very long resume text without issues', () => {
      const jd = 'Python and react. Python and react skills.';
      // 5000 lines of filler + the real keywords at the end
      const filler = Array(5000)
        .fill('Performed various operational tasks and maintained systems.')
        .join('\n');
      const resume = `${filler}\nPython developer. React frontend. Python and react.`;
      const start = performance.now();
      const result = scanResume(resume, jd);
      const elapsed = performance.now() - start;
      expect(result.matchPercentage).toBeGreaterThan(0);
      // Should complete in under 2 seconds
      expect(elapsed).toBeLessThan(2000);
    });

    it('identical resume and JD yields 100% match', () => {
      const text =
        'Python developer with react and typescript. ' +
        'Python and react and typescript skills. ' +
        'Python react typescript experience.';
      const result = scanResume(text, text);
      expect(result.matchPercentage).toBe(100);
    });
  });
});
