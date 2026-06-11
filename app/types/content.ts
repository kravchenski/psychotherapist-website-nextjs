export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type HomeContent = {
  hero: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    photoUrl?: string;
  };
  about: {
    label: string;
    heading: string;
    intro: string;
    description: string;
    photoUrl?: string;
    timeline: Array<{
      year: string;
      title?: string;
      institution?: string;
      courses?: string[];
    }>;
  };
  services: {
    label: string;
    description: string;
    highlight: string;
    cardTitle: string;
    cardDescription: string;
    price: string;
    buttonText: string;
    items: string[];
  };
  contacts: {
    label: string;
    description: string;
    phoneLabel: string;
    phoneValue: string;
    hoursLabel: string;
    hoursValue: string;
    hoursSubValue?: string;
  };
  footer: {
    brandTitle: string;
    description: string;
    navigationTitle: string;
    infoTitle: string;
    requisitesTitle: string;
    requisites: string[];
    copyright: string;
  };
  payment: {
    eyebrow: string;
    title: string;
    description: string;
    homeTitle: string;
    sections: LegalSection[];
    customPaymentDevLinkText: string;
    customPaymentDevLinkUrl: string;
    publicOfferLinkText: string;
  };
  publicOffer: {
    eyebrow: string;
    title: string;
    description: string;
    sections: LegalSection[];
  };
  privacyPolicy: {
    eyebrow: string;
    title: string;
    description: string;
    sections: LegalSection[];
  };
};
