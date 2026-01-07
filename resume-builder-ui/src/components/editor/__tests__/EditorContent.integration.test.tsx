// src/components/editor/__tests__/EditorContent.integration.test.tsx
// Integration tests for EditorContent component workflow

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { EditorContent, EditorContentProps } from '../EditorContent';
import { Section, ContactInfo } from '../../../types';

// Keep some mocks but make others more realistic for integration testing
vi.mock('../../ContactInfoSection', () => ({
  default: ({
    contactInfo,
    onUpdate,
  }: {
    contactInfo: ContactInfo;
    onUpdate: (info: ContactInfo) => void;
  }) => (
    <div data-testid="contact-info-section">
      <label>
        Full Name
        <input
          type="text"
          value={contactInfo.name}
          onChange={(e) =>
            onUpdate({ ...contactInfo, name: e.target.value })
          }
          aria-label="Full Name"
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={contactInfo.email}
          onChange={(e) =>
            onUpdate({ ...contactInfo, email: e.target.value })
          }
          aria-label="Email"
        />
      </label>
      <label>
        Phone
        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) =>
            onUpdate({ ...contactInfo, phone: e.target.value })
          }
          aria-label="Phone"
        />
      </label>
    </div>
  ),
}));

vi.mock('../../FormattingHelp', () => ({
  default: () => <div data-testid="formatting-help">Formatting Help</div>,
}));

vi.mock('../../ExperienceSection', () => ({
  default: ({
    sectionName,
    experiences,
    onDelete,
    onDeleteEntry,
  }: {
    sectionName: string;
    experiences: unknown[];
    onUpdate: (entries: unknown[]) => void;
    onDelete: () => void;
    onDeleteEntry: (index: number) => void;
  }) => (
    <div data-testid="experience-section" role="region" aria-label={`${sectionName} section`}>
      <h2>{sectionName}</h2>
      <span>Entries: {experiences?.length || 0}</span>
      <button onClick={onDelete} aria-label={`Delete ${sectionName} section`}>
        Delete Section
      </button>
      {(experiences || []).map((_: unknown, index: number) => (
        <button
          key={index}
          onClick={() => onDeleteEntry(index)}
          aria-label={`Delete entry ${index + 1}`}
        >
          Delete Entry {index + 1}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../EducationSection', () => ({
  default: ({
    sectionName,
    education,
    onDelete,
  }: {
    sectionName: string;
    education: unknown[];
    onUpdate: (entries: unknown[]) => void;
    onDelete: () => void;
  }) => (
    <div data-testid="education-section" role="region" aria-label={`${sectionName} section`}>
      <h2>{sectionName}</h2>
      <span>Entries: {education?.length || 0}</span>
      <button onClick={onDelete} aria-label={`Delete ${sectionName} section`}>
        Delete Section
      </button>
    </div>
  ),
}));

vi.mock('../../GenericSection', () => ({
  default: ({
    section,
    onUpdate,
    onDelete,
  }: {
    section: Section;
    onUpdate: (section: Section) => void;
    onDelete: () => void;
  }) => (
    <div data-testid="generic-section" role="region" aria-label={`${section.name} section`}>
      <h2>{section.name}</h2>
      <button onClick={onDelete} aria-label={`Delete ${section.name} section`}>
        Delete Section
      </button>
    </div>
  ),
}));

vi.mock('../../IconListSection', () => ({
  default: ({ sectionName }: { sectionName: string }) => (
    <div data-testid="icon-list-section" role="region" aria-label={`${sectionName} section`}>
      <h2>{sectionName}</h2>
    </div>
  ),
}));

vi.mock('../../EditorToolbar', () => ({
  default: ({
    onAddSection,
    onExportYAML,
    onLoadEmptyTemplate,
    onToggleHelp,
  }: {
    onAddSection: () => void;
    onExportYAML: () => void;
    onLoadEmptyTemplate: () => void;
    onToggleHelp: () => void;
  }) => (
    <div data-testid="editor-toolbar" role="toolbar" aria-label="Editor actions">
      <button onClick={onAddSection} aria-label="Add section">
        Add Section
      </button>
      <button onClick={onExportYAML} aria-label="Export YAML">
        Export YAML
      </button>
      <button onClick={onLoadEmptyTemplate} aria-label="Start fresh">
        Start Fresh
      </button>
      <button onClick={onToggleHelp} aria-label="Help">
        Help
      </button>
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
    <div data-testid="mobile-action-bar" role="toolbar" aria-label="Mobile actions">
      <button onClick={onNavigationClick} aria-label="Open navigation">
        Navigation
      </button>
      <button onClick={onPreviewClick} aria-label="Preview resume">
        Preview
      </button>
      <button onClick={onDownloadClick} aria-label="Download resume">
        Download
      </button>
    </div>
  ),
}));

vi.mock('../../MobileNavigationDrawer', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div
        data-testid="mobile-navigation-drawer"
        role="dialog"
        aria-label="Navigation drawer"
        aria-modal="true"
      >
        <button onClick={onClose} aria-label="Close navigation">
          Close Drawer
        </button>
      </div>
    ) : null,
}));

vi.mock('../../SectionNavigator', () => ({
  default: ({
    sections,
    onSectionClick,
  }: {
    sections: Section[];
    onSectionClick: (index: number) => void;
  }) => (
    <nav data-testid="section-navigator" role="navigation" aria-label="Resume sections">
      <ul>
        <li>
          <button onClick={() => onSectionClick(-1)} aria-label="Go to contact info">
            Contact Info
          </button>
        </li>
        {sections.map((section, index) => (
          <li key={index}>
            <button
              onClick={() => onSectionClick(index)}
              aria-label={`Go to ${section.name} section`}
            >
              {section.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  ),
}));

vi.mock('../../DragHandle', () => ({
  default: ({ children, id }: { children: React.ReactNode; id: string }) => (
    <div data-testid={`drag-handle-${id}`} role="listitem">
      {children}
    </div>
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
    <div data-testid="sortable-context" role="list" aria-label="Sortable sections">
      {children}
    </div>
  ),
  verticalListSortingStrategy: {},
}));

vi.mock('@dnd-kit/modifiers', () => ({
  restrictToVerticalAxis: {},
  restrictToWindowEdges: {},
}));

describe('EditorContent Integration Tests', () => {
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
        title: 'Senior Engineer',
        dates: '2020-Present',
        description: ['Led team of 5 engineers'],
      },
      {
        company: 'Startup Inc',
        title: 'Developer',
        dates: '2018-2020',
        description: ['Built features'],
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
        year: '2018',
      },
    ],
  };

  const mockSkillsSection: Section = {
    name: 'Skills',
    type: 'bulleted-list',
    content: ['JavaScript', 'TypeScript', 'React'],
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

  const createDefaultProps = (
    overrides: Partial<EditorContentProps> = {}
  ): EditorContentProps => ({
    contactInfo: mockContactInfo,
    setContactInfo: vi.fn(),
    sections: [],
    supportsIcons: true,
    iconRegistry: mockIconRegistry,
    isAnonymous: false,
    isAuthenticated: true,
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

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Load → Edit → Save Workflow', () => {
    it('should display contact info when loaded', () => {
      render(<EditorContent {...createDefaultProps()} />);

      expect(screen.getByTestId('contact-info-section')).toBeInTheDocument();
      expect(screen.getByLabelText('Full Name')).toHaveValue('John Doe');
      expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
    });

    it('should call setContactInfo when contact info is edited', async () => {
      const setContactInfo = vi.fn();
      render(<EditorContent {...createDefaultProps({ setContactInfo })} />);

      const nameInput = screen.getByLabelText('Full Name');

      // Use fireEvent.change for controlled input to trigger onChange properly
      fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });

      // Verify setContactInfo was called with updated name
      expect(setContactInfo).toHaveBeenCalled();
      const lastCall = setContactInfo.mock.calls[setContactInfo.mock.calls.length - 1][0];
      expect(lastCall.name).toBe('Jane Smith');
    });

    it('should display all sections when loaded', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection, mockEducationSection, mockSkillsSection],
          })}
        />
      );

      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      expect(screen.getByTestId('education-section')).toBeInTheDocument();
      expect(screen.getByTestId('generic-section')).toBeInTheDocument();
    });

    it('should trigger add section modal when Add Section is clicked', async () => {
      const openSectionTypeModal = vi.fn();
      const props = createDefaultProps();
      props.modals.openSectionTypeModal = openSectionTypeModal;

      render(<EditorContent {...props} />);

      const addButton = screen.getByRole('button', { name: /add section/i });
      await user.click(addButton);

      expect(openSectionTypeModal).toHaveBeenCalledTimes(1);
    });

    it('should trigger delete section when delete is clicked', async () => {
      const handleDeleteSection = vi.fn();
      const props = createDefaultProps({
        sections: [mockExperienceSection],
      });
      props.sectionManagement.handleDeleteSection = handleDeleteSection;

      render(<EditorContent {...props} />);

      const deleteButton = screen.getByRole('button', { name: /delete experience section/i });
      await user.click(deleteButton);

      expect(handleDeleteSection).toHaveBeenCalledTimes(1);
    });

    it('should trigger export YAML when export is clicked', async () => {
      const handleExportYAML = vi.fn();
      const props = createDefaultProps();
      props.fileOperations.handleExportYAML = handleExportYAML;

      render(<EditorContent {...props} />);

      const exportButton = screen.getByRole('button', { name: /export yaml/i });
      await user.click(exportButton);

      expect(handleExportYAML).toHaveBeenCalledTimes(1);
    });

    it('should trigger download when download is clicked', async () => {
      const handleGenerateResume = vi.fn();
      const props = createDefaultProps();
      props.editorActions.handleGenerateResume = handleGenerateResume;

      render(<EditorContent {...props} />);

      const downloadButton = screen.getByRole('button', { name: /download resume/i });
      await user.click(downloadButton);

      expect(handleGenerateResume).toHaveBeenCalledTimes(1);
    });
  });

  describe('Section Navigation Workflow', () => {
    it('should navigate to section when clicked in navigator', async () => {
      const scrollToSection = vi.fn();
      const props = createDefaultProps({
        sections: [mockExperienceSection, mockEducationSection],
      });
      props.navigation.scrollToSection = scrollToSection;

      render(<EditorContent {...props} />);

      const experienceNavButton = screen.getByRole('button', {
        name: /go to experience section/i,
      });
      await user.click(experienceNavButton);

      expect(scrollToSection).toHaveBeenCalledWith(0);
    });

    it('should navigate to contact info when clicked', async () => {
      const scrollToSection = vi.fn();
      const props = createDefaultProps({
        sections: [mockExperienceSection],
      });
      props.navigation.scrollToSection = scrollToSection;

      render(<EditorContent {...props} />);

      const contactNavButton = screen.getByRole('button', { name: /go to contact info/i });
      await user.click(contactNavButton);

      expect(scrollToSection).toHaveBeenCalledWith(-1);
    });
  });

  describe('Mobile Workflow', () => {
    it('should open navigation drawer on mobile', async () => {
      const openNavigationDrawer = vi.fn();
      const props = createDefaultProps();
      props.modals.openNavigationDrawer = openNavigationDrawer;

      render(<EditorContent {...props} />);

      const navButton = screen.getByRole('button', { name: /open navigation/i });
      await user.click(navButton);

      expect(openNavigationDrawer).toHaveBeenCalledTimes(1);
    });

    it('should render and close navigation drawer', async () => {
      const closeNavigationDrawer = vi.fn();
      const props = createDefaultProps();
      props.modals.showNavigationDrawer = true;
      props.modals.closeNavigationDrawer = closeNavigationDrawer;

      render(<EditorContent {...props} />);

      expect(screen.getByTestId('mobile-navigation-drawer')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /close navigation/i });
      await user.click(closeButton);

      expect(closeNavigationDrawer).toHaveBeenCalledTimes(1);
    });

    it('should trigger preview on mobile', async () => {
      const handleOpenPreview = vi.fn();
      const props = createDefaultProps();
      props.editorActions.handleOpenPreview = handleOpenPreview;

      render(<EditorContent {...props} />);

      const previewButton = screen.getByRole('button', { name: /preview resume/i });
      await user.click(previewButton);

      expect(handleOpenPreview).toHaveBeenCalledTimes(1);
    });
  });

  describe('AI Warning Banner Workflow', () => {
    it('should display AI warning and allow dismissal', async () => {
      const closeAIWarning = vi.fn();
      const props = createDefaultProps();
      props.modals.showAIWarning = true;
      props.modals.closeAIWarning = closeAIWarning;

      render(<EditorContent {...props} />);

      expect(screen.getByText('Imported Resume - Please Review')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /close review banner/i });
      await user.click(closeButton);

      expect(closeAIWarning).toHaveBeenCalledTimes(1);
    });
  });

  describe('Start Fresh Workflow', () => {
    it('should trigger start fresh when clicked', async () => {
      const handleStartFresh = vi.fn();
      const props = createDefaultProps();
      props.editorActions.handleStartFresh = handleStartFresh;

      render(<EditorContent {...props} />);

      const startFreshButton = screen.getByRole('button', { name: /start fresh/i });
      await user.click(startFreshButton);

      expect(handleStartFresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('Section CRUD Operations', () => {
    it('should handle deleting an entry from a section', async () => {
      const handleDeleteEntry = vi.fn();
      const props = createDefaultProps({
        sections: [mockExperienceSection],
      });
      props.sectionManagement.handleDeleteEntry = handleDeleteEntry;

      render(<EditorContent {...props} />);

      // Experience section has 2 entries
      const deleteEntryButton = screen.getByRole('button', { name: /delete entry 1/i });
      await user.click(deleteEntryButton);

      expect(handleDeleteEntry).toHaveBeenCalledTimes(1);
    });

    it('should render correct number of entries', () => {
      render(
        <EditorContent
          {...createDefaultProps({
            sections: [mockExperienceSection],
          })}
        />
      );

      expect(screen.getByText('Entries: 2')).toBeInTheDocument();
    });
  });

  describe('Layout Changes', () => {
    it('should have correct margins when sidebar is expanded', () => {
      const { container } = render(
        <EditorContent
          {...createDefaultProps({
            navigation: {
              activeSectionIndex: 0,
              isSidebarCollapsed: false,
              scrollToSection: vi.fn(),
              setIsSidebarCollapsed: vi.fn(),
            },
          })}
        />
      );

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('lg:mr-[296px]');
    });

    it('should have correct margins when sidebar is collapsed', () => {
      const { container } = render(
        <EditorContent
          {...createDefaultProps({
            navigation: {
              activeSectionIndex: 0,
              isSidebarCollapsed: true,
              scrollToSection: vi.fn(),
              setIsSidebarCollapsed: vi.fn(),
            },
          })}
        />
      );

      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass('lg:mr-[88px]');
    });
  });

  describe('File Input', () => {
    it('should handle file input change', async () => {
      const handleFileInputChange = vi.fn();
      const props = createDefaultProps();
      props.fileOperations.handleFileInputChange = handleFileInputChange;

      render(<EditorContent {...props} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();

      const file = new File(['test content'], 'test.yaml', { type: 'application/x-yaml' });
      await user.upload(fileInput, file);

      expect(handleFileInputChange).toHaveBeenCalled();
    });
  });
});
