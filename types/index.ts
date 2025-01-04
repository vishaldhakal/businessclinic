export type NatureOfIndustryCategory = {
  id: number;
  name: string;
}

export type NatureOfIndustrySubCategory = {
  id: number;
  name: string;
  category: NatureOfIndustryCategory;
}

export type Issue = {
  id?: number;
  title: string;
  description: string;
  issue_image?: File | null;
  
  // Categorization
  nature_of_issue: string;
  industry_specific_or_common_issue: boolean;
  policy_related_or_procedural_issue: boolean;
  implementation_level_policy_level_or_capacity_scale: boolean;
  
  // Industry Information
  industry_size: 'Startup' | 'Micro' | 'Cottage' | 'Small' | 'Medium' | 'Large';
  nature_of_industry_category: number;
  nature_of_industry_sub_category: number;
  
  // Company Information
  name_of_company: string;
  member_of_CIM: boolean;
  
  // Address Information
  address_province: string;
  address_district: string;
  address_municipality: string;
  address_ward: string;
  address_street: string;
  
  // Contact Information
  contact_name: string;
  contact_designation: string;
  contact_number: string;
  contact_alternate_number?: string;
  contact_email?: string;
  
  // Status
  progress_status?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
} 