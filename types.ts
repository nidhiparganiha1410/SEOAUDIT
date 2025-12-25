
export interface SEOAuditReport {
  domain: string;
  overallScore: number;
  categories: {
    onPage: SEOMetric;
    technical: SEOMetric;
    offPage: SEOMetric;
    authority: SEOMetric;
    indexing: SEOMetric;
  };
  keyFindings: KeyFinding[];
  competitorInsights: CompetitorInsight[];
  actionPlan: ActionStep[];
  groundingSources?: GroundingSource[];
}

export interface SEOMetric {
  score: number;
  status: 'good' | 'warning' | 'critical';
  details: string[];
}

export interface KeyFinding {
  type: 'Positive' | 'Negative' | 'Neutral';
  category: string;
  message: string;
}

export interface CompetitorInsight {
  competitor: string;
  advantage: string;
  threat: string;
}

export interface ActionStep {
  priority: 'High' | 'Medium' | 'Low';
  task: string;
  impact: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}
