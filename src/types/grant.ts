// ============================================
// GRANT TYPES
// ============================================

export interface CustomVesting {
  vestingDate: string;
  percentageVested: string;
}

export interface Grant {
  id: string;
  company: string;
  grantDate: string;
  numberOfShares: string;
  grantPrice: string;
  vestingSchedule: "standard" | "custom";
  customVesting: CustomVesting[];
  createdAt: string;
}

export type GrantFormData = Omit<Grant, "id" | "createdAt">;

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface AllGrantsPageProps {
  grants: Grant[];
  onAdd: () => void;
  onEdit: (grant: Grant) => void;
  onDelete: (grantId: string) => void;
  onViewDetails: (grant: Grant) => void;
}

export interface AddEditGrantPageProps {
  grant?: Grant | null;
  onBack: () => void;
  onSave: (grantData: GrantFormData) => void;
}

export interface GrantDetailsPageProps {
  grant: Grant | null;
  onBack: () => void;
  onEdit: () => void;
}

export interface GrantCardProps {
  grant: Grant;
  onEdit: (grant: Grant) => void;
  onDelete: (grantId: string) => void;
  onViewDetails: (grant: Grant) => void;
}

// ============================================
// MAIN APP STATE & FUNCTIONS
// ============================================

export interface GrantsAppState {
  currentView: "all-grants" | "add-grant" | "grant-details";
  grants: Grant[];
  editingGrant: Grant | null;
  selectedGrant: Grant | null;
}

export interface GrantsAppFunctions {
  addGrant: (grantData: GrantFormData) => void;
  updateGrant: (grantData: GrantFormData) => void;
  deleteGrant: (grantId: string) => void;
  navigateToAddGrant: () => void;
  navigateToEditGrant: (grant: Grant) => void;
  navigateToGrantDetails: (grant: Grant) => void;
  navigateToAllGrants: () => void;
}

// ============================================
// FORM VALIDATION TYPES
// ============================================

export interface FormErrors {
  company?: string;
  grantDate?: string;
  numberOfShares?: string;
  grantPrice?: string;
  customVesting?: {
    vestingDate?: string;
    percentageVested?: string;
  }[];
}

// ============================================
// UTILITY TYPES
// ============================================

export interface GrantCalculations {
  totalValue: number;
  sharesPerYear?: number;
  vestingInfo: VestingInfo[];
}

export interface VestingInfo {
  year?: string;
  date: string;
  percentage?: string;
  shares: number;
  value: number;
}

export interface GrantsStorage {
  saveGrants: (grants: Grant[]) => void;
  loadGrants: () => Grant[];
  clearGrants: () => void;
}
