# AI Rules & Skills

This folder contains skill definitions that can be activated in prompts to provide specialized context and expertise.

## Available Skills

### SKILL:developer
**File**: `developer.md`

Expert fullstack developer with deep frontend UI/UX expertise. Provides:
- React/Next.js best practices
- TypeScript expertise
- Tailwind CSS and design systems
- Component architecture
- Performance optimization
- Accessibility standards
- SEO best practices
- Code quality standards

**Usage**: Add `SKILL:developer` to your prompt to activate developer expertise.

### SKILL:product
**File**: `product.md`

Expert creative product manager specializing in developer tools research and product strategy. Provides:
- Market research and trend analysis
- Tool discovery and recommendations
- User research insights
- Product strategy and roadmap
- Feature prioritization
- Growth strategies
- Competitive analysis

**Usage**: Add `SKILL:product` to your prompt to activate product manager expertise.

### SKILL:image-creator
**File**: `image-creator.md`

Expert AI image and logo creator specializing in generating professional graphics for web applications. Provides:
- Logo design and brand identity
- Icon creation for tools and features
- Image generation prompt engineering
- Technical specifications and optimization
- Style consistency and brand guidelines
- Free and paid AI generation options

**Usage**: Add `SKILL:image-creator` to your prompt when you need to generate logos, icons, or visual assets for iziTools.

## How to Use

### Basic Usage

In your Cursor prompt, simply include the skill at the beginning:

```
SKILL:developer
[Your actual prompt/question]
```

or

```
SKILL:product
[Your actual prompt/question]
```

**See [USAGE.md](./USAGE.md) for detailed examples and best practices.**

### Combined Skills

You can use both skills together:

```
SKILL:developer SKILL:product
[Your prompt that needs both technical and product expertise]
```

### Examples

**Developer-focused prompt**:
```
SKILL:developer
Create a new tool component for JSON formatter with proper TypeScript types and Tailwind styling.
```

**Product-focused prompt**:
```
SKILL:product
What are the top 5 developer tools we should build next based on current market trends?
```

**Combined prompt**:
```
SKILL:developer SKILL:product
Design and implement a new tool that solves a common developer pain point. Include market research justification.
```

**Image creation prompt**:
```
SKILL:image-creator
Create a logo for iziTools and icons for the JSON Formatter and Regex Tester tools.
```

## Skill Activation

When you use `SKILL:developer` or `SKILL:product` in your prompt:
1. The AI will automatically load the corresponding skill file
2. Apply the expertise and guidelines from that skill
3. Respond with that specialized knowledge in mind
4. Follow the best practices and standards defined in the skill

## Customization

You can customize these skills by editing the `.md` files:
- Add project-specific guidelines
- Update with new best practices
- Include recent learnings or patterns
- Modify to match your preferences

## Adding New Skills

To add a new skill:

1. Create a new `.md` file in `.ai-rules/` folder
2. Name it descriptively (e.g., `designer.md`, `seo.md`)
3. Define the role, expertise, and guidelines
4. Update this README with the new skill
5. Use `SKILL:skillname` in prompts to activate

## Best Practices

- **Be Specific**: Use skills when you need specialized expertise
- **Combine When Needed**: Use multiple skills for complex tasks
- **Keep Updated**: Regularly update skill files with new learnings
- **Project Context**: Skills are tailored for iziTools project
- **Clear Prompts**: Still write clear prompts, skills enhance context

---

**Note**: These skills are designed specifically for the iziTools project context and can be customized as needed.
