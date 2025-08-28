import { USER_PROMPT } from "@/lib/prompts";
import {
  SystemPromptJSON,
  Example,
  Tool,
  UserPromptJSON,
} from "@/types/propmts.type";

export function generateSystemPrompt(promptJson: SystemPromptJSON): string {
  let prompt = `# SYSTEM PROMPT\n\n`;

  // Role
  prompt += `## ROLE\n${promptJson.role}\n\n`;

  // Behavior & Tone
  prompt += `---\n## BEHAVIOR & TONE\n`;
  prompt +=
    promptJson.behavior_and_tone.map((r) => `- ${r}`).join("\n") + "\n\n";

  // Input & Output
  prompt += `---\n## INPUT & OUTPUT\n`;
  prompt += `### Input:\n${promptJson.input_and_output.input
    .map((i) => `- ${i}`)
    .join("\n")}\n`;
  prompt += `### Output:\n${promptJson.input_and_output.output
    .map((o) => `- ${o}`)
    .join("\n")}\n`;
  prompt += `### Example Output:\n${JSON.stringify(
    promptJson.input_and_output.example_output,
    null,
    2
  )}\n\n`;

  // Default Language
  prompt += `---\n## DEFAULT LANGUAGE\n- ${promptJson.default_language}\n\n`;

  // Tools
  prompt += `---\n## TOOLS\n### Available Tools:\n`;
  promptJson.tools.available_tools.forEach((tool: Tool) => {
    prompt += `- ${tool.name}: ${tool.description}\n`;
    if (tool.input) prompt += `  Input: ${JSON.stringify(tool.input)}\n`;
    if (tool.output) prompt += `  Output: ${JSON.stringify(tool.output)}\n`;
  });
  prompt += `### Tool Usage Rules:\n${promptJson.tools.rules
    .map((r) => `- ${r}`)
    .join("\n")}\n\n`;

  // Rules & Constraints
  prompt += `---\n## RULES & CONSTRAINTS\n`;
  prompt +=
    promptJson.rules_and_constraints.map((r) => `- ${r}`).join("\n") + "\n\n";

  // Context Handling
  prompt += `---\n## CONTEXT HANDLING\n`;
  prompt +=
    promptJson.context_handling.map((c) => `- ${c}`).join("\n") + "\n\n";

  // Examples
  prompt += `---\n## EXAMPLES\n`;
  promptJson.examples.forEach((ex: Example, idx) => {
    prompt += `Example ${idx + 1}:\nCustomer: ${ex.customer}\nAI: ${ex.ai}\n`;
    if (ex.tool_usage) prompt += `Tool Usage: ${ex.tool_usage}\n`;
    prompt += "\n";
  });

  // Optional Extensions
  prompt += `---\n## OPTIONAL EXTENSIONS\n`;
  prompt +=
    promptJson.optional_extensions.map((ext) => `- ${ext}`).join("\n") + "\n";

  return prompt;
}

export function generateUserPrompt(userPrompt: string): string {
  const promptJson: UserPromptJSON = {
    settings: USER_PROMPT.settings,
    rules: USER_PROMPT.rules,
    tools: USER_PROMPT.tools,
    userInstructions: userPrompt,
  };

  // Convert JSON into a readable markdown-style prompt
  let prompt = `# USER PROMPT\n\n`;

  // Instructions
  prompt += `## Instructions\n${promptJson.userInstructions}\n\n`;

  // Settings
  prompt += `---\n## Settings\n`;
  prompt += `- Max Sentences: ${promptJson.settings.maxSentences}\n`;
  prompt += `- Default Language: ${promptJson.settings.defaultLanguage}\n`;
  prompt += `- Allowed Languages: ${promptJson.settings.allowedLanguages.join(
    ", "
  )}\n`;

  if (promptJson.settings.enforceRules) {
    prompt +=
      "\n- Always respect the system prompt rules; do not override or contradict them.\n";
  }

  // Rules
  prompt += `---\n## Rules\n`;
  prompt += `${promptJson.rules.map((r) => `- ${r}`).join("\n")}\n\n`;

  // Tools
  prompt += `---\n## Available Tools\n`;
  prompt += `${promptJson.tools.map((t) => `- ${t}`).join("\n")}\n`;

  return prompt;
}
