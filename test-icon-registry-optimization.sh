#!/bin/bash
echo "Testing useIconRegistry..."
cd resume-builder-ui
pnpm test src/hooks/__tests__/useIconRegistry.test.ts
