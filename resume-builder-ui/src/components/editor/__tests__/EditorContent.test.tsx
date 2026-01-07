// src/components/editor/__tests__/EditorContent.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorContent, EditorContentProps } from '../EditorContent';
import { Section, ContactInfo } from '../../../types';
import React from 'react';

// Mock all child components
vi.mock('../../ContactInfoSection', () => ({
  default: ({ contactInfo }: { contactInfo: ContactInfo }) => (
    <div data-testid="contact-info-section">
      <span>Contact: {contactInfo.name}</span>
    </div>
  ),
}));

vi.mock('../../FormattingHelp', () => ({
  default: () => <div data-testid="formatting-help">Formatting Help</div>,
}));

vi.mock('../../ExperienceSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => (
    <div data-testid="experience-section">
      <span>Experience: {sectionName}</span>
    </div>
  ),
}));

vi.mock('../../EducationSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => (
    <div data-testid="education-section">
      <span>Education: {sectionName}</span>
    </div>
  ),
}));

vi.mock('../../GenericSection', () => ({
  default: ({ section }: { section: Section }) => (
    <div data-testid="generic-section">
      <span>Generic: {section.name}</span>
    </div>
  ),
}));

vi.mock('../../IconListSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => (
    <div data-testid="icon-list-section">
      <span>IconList: {sectionName}</span>
    </div>
  ),
}));

vi.mock('../../EditorToolbar', () => ({
  default: ({ onAddSection }: { onAddSection: () => void }) => (
    <div data-testid="editor-toolbar">
      <button onClick={onAddSection}>Add Section</button>
    </div>
  ),
}));

vi.mock('../../MobileActionBar', () => ({
  default: ({
    onNavigationClick,
    onPreviewClick,
    onDownloadClick,
  }: {
    onNavigationClick: () => void;
    onPreviewClick: () => void;
    onDownloadClick: () => void;
  }) => (
    <div data-testid="mobile-action-bar">
      <button onClick={onNavigationClick}>Navigation</button>
      <button onClick={onPreviewClick}>Preview</button>
      <button onClick={onDownloadClick}>Download</button>
    </div>
  ),
}));

vi.mock('../../MobileNavigationDrawer', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="mobile-navigation-drawer">
        <button onClick={onClose}>Close Drawer</button>
      </div>
    ) : null,
}));

vi.mock('../../SectionNavigator', () => ({
  default: ({ sections }: { sections: Section[] }) => (
    <div data-testid="section-navigator">
      <span>Sections: {sections.length}</span>
    </div>
  ),
}));

vi.mock('../../DragHandle', () => ({
  default: ({ children, id }: { children: React.ReactNode; id: string }) => (
    <div data-testid={`drag-handle-${id}`}>{children}</div>
  ),
}));

// Mock @dnd-kit modules
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dnd-context">{children}</div>
  ),
  closestCenter: vi.fn(),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drag-overlay">{children}</div>
  ),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sortable-context">{children}</div>
  ),
  verticalListSortingStrategy: {},
}));

vi.mock('@dnd-kit/modifiers', () => ({
  restrictToVerticalAxis: {},
  restrictToWindowEdges: {},
}));

describe('EditorContent', () => {
  // Sample data
  const mockContactInfo: ContactInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-1234',
    location: 'New York, NY',
  };

  const mockExperienceSection: Section = {
    name: 'Experience',
    type: 'experience',
    content: [
      {
        company: 'Tech Corp',
        title: 'Engineer',
        dates: '2020-Present',
        description: ['Did things'],
      },
    ],
  };

  const mockEducationSection: Section = {
    name: 'Education',
    type: 'education',
    content: [
      {
        degree: 'BS Computer Science',
        school: 'MIT',
        year: '2020',
      },
    ],
  };

  const mockIconListSection: Section = {
    name: 'Certifications',
    type: 'icon-list',
    content: [
      {
        certification: 'AWS',
        issuer: 'Amazon',
        date: '2023',
        icon: 'aws.png',
      },
    ],
  };

  const mockGenericSection: Section = {
    name: 'Skills',
    type: 'bulleted-list',
    content: ['JavaScript', 'TypeScript'],
  };

  const mockIconRegistry = {
    registerIcon: vi.fn(),
    registerIconWithFilename: vi.fn(),
    getIconFile: vi.fn(),
    removeIcon: vi.fn(),
    clearRegistry: vi.fn(),
    getRegisteredFilenames: vi.fn().mockReturnValue([]),
    getRegistrySize: vi.fn().mockReturnValue(0),
  };

  const mockRefs = {
    contactInfoRef: { current: null } as React.RefObject<HTMLDivElement>,
    sectionRefs: { current: [] } as React.MutableRefObject<(HTMLDivElement | null)[]>,
    newSectionRef: { current: null } as React.MutableRefObject<HTMLDivElement | null>,
  };

  const createDefaultProps = (overrides: Partial<EditorContentProps> = {}): EditorContentProps => ({
    contactInfo: mockContactInfo,
    setContactInfo: vi.fn(),
    sections: [],
    supportsIcons: true,
    iconRegistry: mockIconRegistry,
    contactForm: {
      socialLinkErrors: {},
      autoGeneratedIndexes: new Set(),
      handleSocialLinkChange: vi.fn(),
      handleAddSocialLink: vi.fn(),
      handleRemoveSocialLink: vi.fn(),
    },
    dragDrop: {
      sensors: [],
      activeId: null,
      draggedSection: null,
      handleDragStart: vi.fn(),
      handleDragEnd: vi.fn(),
      handleDragCancel: vi.fn(),
    },
    sectionManagement: {
      editingTitleIndex: null,
      temporaryTitle: '',
      setTemporaryTitle: vi.fn(),
      handleUpdateSection: vi.fn(),
      handleDeleteSection: vi.fn(),
      handleDeleteEntry: vi.fn(),
      handleTitleEdit: vi.fn(),
      handleTitleSave: vi.fn(),
      handleTitleCancel: vi.fn(),
    },
    navigation: {
      activeSectionIndex: 0,
      isSidebarCollapsed: false,
      scrollToSection: vi.fn(),
      setIsSidebarCollapsed: vi.fn(),
    },
    modals: {
      showAIWarning: false,
      showAdvancedMenu: false,
      showNavigationDrawer: false,
      closeAIWarning: vi.fn(),
      openAdvancedMenu: vi.fn(),
      closeAdvancedMenu: vi.fn(),
      openNavigationDrawer: vi.fn(),
      closeNavigationDrawer: vi.fn(),
      openSectionTypeModal: vi.fn(),
      openHelpModal: vi.fn(),
    },
    fileOperations: {
      handleExportYAML: vi.fn(),
      handleFileInputChange: vi.fn(),
      fileInputRef: { current: null } as React.RefObject<HTMLInputElement>,
      loadingSave: false,
      loadingLoad: false,
    },
    editorActions: {
      handleGenerateResume: vi.fn(),
      handleOpenPreview: vi.fn(),
      handleStartFresh: vi.fn(),
      isDownloading: false,
    },
    preview: {
      isGenerating: false,
      isStale: false,
    },
    saveStatus: {
      saveStatus: 'saved',
      lastSaved: new Date(),
    },
    refs: mockRefs,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the main container', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
      expect(screen.getByTestId('formatting-help')).toBeInTheDocument();
    });

    it('should render contact info section when contactInfo is provided', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('contact-info-section')).toBeInTheDocument();
      expect(screen.getByText('Contact: John Doe')).toBeInTheDocument();
    });

    it('should not render contact info section when contactInfo is null', () => {
      render(<EditorContent {...createDefaultProps({ contactInfo: null })} />);

      expect(screen.queryByTestId('contact-info-section')).not.toBeInTheDocument();
    });

    it('should render formatting help', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('formatting-help')).toBeInTheDocument();
    });

    it('should render section navigator', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('section-navigator')).toBeInTheDocument();
    });

    it('should render mobile action bar', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('mobile-action-bar')).toBeInTheDocument();
    });
  });

  describe('AI Warning Banner', () => {
    it('should not render AI warning when showAIWarning is false', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.queryByText('Imported Resume - Please Review')).not.toBeInTheDocument();
    });

    it('should render AI warning when showAIWarning is true', () => {
      const props = createDefaultProps();
      props.modals.showAIWarning = true;

      render(<EditorContent {...props} />);

      expect(screen.getByText('Imported Resume - Please Review')).toBeInTheDocument();
      expect(
        screen.getByText('Please review all information for accuracy and completeness.')
      ).toBeInTheDocument();
    });

    it('should call closeAIWarning when dismiss button is clicked', () => {
      const closeAIWarning = vi.fn();
      const props = createDefaultProps();
      props.modals.showAIWarning = true;
      props.modals.closeAIWarning = closeAIWarning;

      render(<EditorContent {...props} />);

      const closeButton = screen.getByRole('button', { name: 'Close review banner' });
      fireEvent.click(closeButton);

      expect(closeAIWarning).toHaveBeenCalledTimes(1);
    });
  });

  describe('Section Rendering', () => {
    it('should render experience sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      expect(screen.getByText('Experience: Experience')).toBeInTheDocument();
    });

    it('should render education sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockEducationSection],
          })}
        />
      );

      expect(screen.getByTestId('education-section')).toBeInTheDocument();
      expect(screen.getByText('Education: Education')).toBeInTheDocument();
    });

    it('should render icon-list sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockIconListSection],
          })}
        />
      );

      expect(screen.getByTestId('icon-list-section')).toBeInTheDocument();
      expect(screen.getByText('IconList: Certifications')).toBeInTheDocument();
    });

    it('should render generic sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockGenericSection],
          })}
        />
      );

      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
      expect(screen.getByText('Generic: Skills')).toBeInTheDocument();
    });

    it('should render multiple sections', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [
              mockExperienceSection,
              mockEducationSection,
              mockGenericSection,
            ],
          })}
        />
      );

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      expect(screen.getByTestId('education-section')).toBeInTheDocument();
      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
    });

    it('should wrap sections in DragHandle', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      expect(screen.getByTestId('drag-handle-0')).toBeInTheDocument();
    });
  });

  describe('Drag and Drop', () => {
    it('should render DndContext', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    });

    it('should render SortableContext', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
    });

    it('should render DragOverlay', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
    });
  });

  describe('Navigation Drawer', () => {
    it('should not render navigation drawer when closed', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.queryByTestId('mobile-navigation-drawer')).not.toBeInTheDocument();
    });

    it('should render navigation drawer when open', () => {
      const props = createDefaultProps();
      props.modals.showNavigationDrawer = true;

      render(<EditorContent {...props} />);

      expect(screen.getByTestId('mobile-navigation-drawer')).toBeInTheDocument();
    });

    it('should call closeNavigationDrawer when drawer close is clicked', () => {
      const closeNavigationDrawer = vi.fn();
      const props = createDefaultProps();
      props.modals.showNavigationDrawer = true;
      props.modals.closeNavigationDrawer = closeNavigationDrawer;

      render(<EditorContent {...props} />);

      const closeButton = screen.getByText('Close Drawer');
      fireEvent.click(closeButton);

      expect(closeNavigationDrawer).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mobile Action Bar', () => {
    it('should call openNavigationDrawer when navigation button is clicked', () => {
      const openNavigationDrawer = vi.fn();
      const props = createDefaultProps();
      props.modals.openNavigationDrawer = openNavigationDrawer;

      render(<EditorContent {...props} />);

      const navButton = screen.getByText('Navigation');
      fireEvent.click(navButton);

      expect(openNavigationDrawer).toHaveBeenCalledTimes(1);
    });

    it('should call handleOpenPreview when preview button is clicked', () => {
      const handleOpenPreview = vi.fn();
      const props = createDefaultProps();
      props.editorActions.handleOpenPreview = handleOpenPreview;

      render(<EditorContent {...props} />);

      const previewButton = screen.getByText('Preview');
      fireEvent.click(previewButton);

      expect(handleOpenPreview).toHaveBeenCalledTimes(1);
    });

    it('should call handleGenerateResume when download button is clicked', () => {
      const handleGenerateResume = vi.fn();
      const props = createDefaultProps();
      props.editorActions.handleGenerateResume = handleGenerateResume;

      render(<EditorContent {...props} />);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      expect(handleGenerateResume).toHaveBeenCalledTimes(1);
    });
  });

  describe('Editor Toolbar', () => {
    it('should call openSectionTypeModal when add section is clicked', () => {
      const openSectionTypeModal = vi.fn();
      const props = createDefaultProps();
      props.modals.openSectionTypeModal = openSectionTypeModal;

      render(<EditorContent {...props} />);

      const addButton = screen.getByText('Add Section');
      fireEvent.click(addButton);

      expect(openSectionTypeModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hidden File Input', () => {
    it('should render hidden file input', () => {
      render(<EditorContent {...createDefaultProps()} />);

      const input = document.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('hidden');
      expect(input).toHaveAttribute('accept', '.yaml,.yml');
    });
  });

  describe('Sidebar Collapse', () => {
    it('should have expanded sidebar margins when not collapsed', () => {
      const props = createDefaultProps();
      props.navigation.isSidebarCollapsed = false;

      const { container } = render(<EditorContent {...props} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('lg:mr-[296px]');
    });

    it('should have collapsed sidebar margins when collapsed', () => {
      const props = createDefaultProps();
      props.navigation.isSidebarCollapsed = true;

      const { container } = render(<EditorContent {...props} />);

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('lg:mr-[88px]');
    });
  });

  describe('Section Navigator', () => {
    it('should display section count', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection, mockEducationSection],
          })}
        />
      );

      expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    });
  });
});
