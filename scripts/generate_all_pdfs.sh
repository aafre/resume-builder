#!/bin/bash
python resume_generator.py --template ats-optimized --input samples/ats-optimized/sample_data.yml --output output/ats-optimized.pdf && \
python resume_generator.py --template two-column --input samples/two-column/sample_data.yml --output output/two-column.pdf && \
python resume_generator.py --template student --input samples/student/sample_data.yml --output output/student.pdf && \
python resume_generator.py --template uk-cv --input samples/uk-cv/sample_data.yml --output output/uk-cv.pdf && \
python resume_generator.py --template ats-optimized --input samples/ats-optimized/sample_data_senior.yml --output output/ats-senior.pdf && \
python resume_generator.py --template ats-optimized --input samples/ats-optimized/sample_data_many_socials.yml --output output/ats-many-socials.pdf && \
python resume_generator.py --template two-column --input samples/two-column/sample_data_many_socials.yml --output output/twocol-many-socials.pdf && \
echo "All 7 PDFs generated in output/"
