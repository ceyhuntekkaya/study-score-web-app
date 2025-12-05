import contactData from '@/data/contact.json';

export interface PhoneInfo {
  number: string;
  display: string;
  href: string;
}

export interface EmailInfo {
  address: string;
  display: string;
  href: string;
}

export interface AddressInfo {
  line1: string;
  line2: string;
  full: string;
  display: string;
}

export interface SocialInfo {
  url: string;
  label: string;
}

export interface CopyrightLink {
  label: string;
  href: string;
}

export interface ContactData {
  phone: {
    primary: PhoneInfo;
    secondary?: PhoneInfo;
    tertiary?: PhoneInfo;
    footer?: PhoneInfo;
  };
  email: {
    primary: EmailInfo;
    secondary?: EmailInfo;
    footer?: EmailInfo;
  };
  address: {
    primary: AddressInfo;
    footer?: AddressInfo;
  };
  social: {
    facebook: SocialInfo;
    twitter: SocialInfo;
    instagram: SocialInfo;
    linkedin: SocialInfo;
    youtube: SocialInfo;
  };
  map: {
    embedUrl: string;
    height: number;
  };
  company: {
    name: string;
    copyright: string;
    website: string;
  };
  copyrightLinks: CopyrightLink[];
}

/**
 * Get contact data
 */
export function getContactData(): ContactData {
  return contactData;
}

/**
 * Get primary phone (default)
 */
export function getPrimaryPhone(): PhoneInfo {
  return contactData.phone.primary;
}

/**
 * Get all phones (primary + secondary + tertiary)
 */
export function getAllPhones(): PhoneInfo[] {
  const phones: PhoneInfo[] = [contactData.phone.primary];
  if (contactData.phone.secondary) phones.push(contactData.phone.secondary);
  if (contactData.phone.tertiary) phones.push(contactData.phone.tertiary);
  return phones;
}

/**
 * Get primary email (default)
 */
export function getPrimaryEmail(): EmailInfo {
  return contactData.email.primary;
}

/**
 * Get all emails (primary + secondary)
 */
export function getAllEmails(): EmailInfo[] {
  const emails: EmailInfo[] = [contactData.email.primary];
  if (contactData.email.secondary) emails.push(contactData.email.secondary);
  return emails;
}

/**
 * Get primary address (default)
 */
export function getPrimaryAddress(): AddressInfo {
  return contactData.address.primary;
}

/**
 * Get social media links
 */
export function getSocialLinks() {
  return contactData.social;
}

/**
 * Get map embed URL
 */
export function getMapEmbedUrl(): string {
  return contactData.map.embedUrl;
}

/**
 * Get company info
 */
export function getCompanyInfo() {
  return contactData.company;
}

/**
 * Get copyright links
 */
export function getCopyrightLinks(): CopyrightLink[] {
  return contactData.copyrightLinks || [];
}

