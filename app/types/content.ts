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
};
