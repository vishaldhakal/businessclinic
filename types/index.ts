export type NatureOfIndustryCategory = {
  id: number;
  name: string;
}

export type NatureOfIndustrySubCategory = {
  id: number;
  name: string;
  category: NatureOfIndustryCategory;
}

export interface IssueAction {
  id: number;
  issue: number;
  action_type: 'status_change' | 'comment' | 'assignment';
  old_status?: string;
  new_status?: string;
  comment?: string;
  created_at: string;
  created_by: number;
  created_by_name: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  name_of_company: string;
  contact_name: string;
  contact_number: string;
  progress_status: string;
  created_at?: string;
  actions?: IssueAction[];
  nature_of_issue: string;
  industry_size: string;
  address_municipality: string;
  address_district: string;
  address_province: string;
  address_ward: string;
  address_street: string;
  implementation_level: "Policy Level" | "Implementation Level" | "Capacity Scale Up";
  share_contact_details: boolean;
  forward_to_authority: boolean;
  industry_specific_or_common_issue: string;
  policy_related_or_procedural_issue: string;
  contact_designation: string | "";
  contact_email: string | "";
  contact_alternate_number: string | "";
  issue_image: string | "";
  member_of_CIM: boolean;
  nature_of_industry_category: NatureOfIndustryCategory | null;
  nature_of_industry_sub_category: NatureOfIndustrySubCategory | null;
} 

export interface IndustryCategory {
  id: number;
  name: string;
}

export interface IndustrySubCategory {
  id: number;
  name: string;
  category: IndustryCategory;
}
