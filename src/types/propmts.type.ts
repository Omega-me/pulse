export type Tool = {
  name: string;
  description: string;
  input?: Record<string, string>;
  output?: Record<string, string>;
};

export type Example = {
  customer: string;
  ai: string;
  tool_usage?: string;
};

export type SystemPromptJSON = {
  role: string;
  behavior_and_tone: string[];
  input_and_output: {
    input: string[];
    output: string[];
    example_output: any;
  };
  default_language: string;
  tools: {
    available_tools: Tool[];
    rules: string[];
  };
  rules_and_constraints: string[];
  context_handling: string[];
  examples: Example[];
  optional_extensions: string[];
};

export type UserPromptSettings = {
  maxSentences?: number;
  defaultLanguage: string;
  allowedLanguages: string[];
  enforceRules: boolean;
};

export type UserPromptJSON = {
  userInstructions?: string;
  settings: UserPromptSettings;
  rules: string[];
  tools: string[];
};
