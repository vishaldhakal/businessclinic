import { ArrowRight, FileText, Search, Send, UserCheck } from "lucide-react";

const steps = [
  {
    title: "Register Issue",
    description: "Fill out our comprehensive issue registration form",
    icon: FileText,
  },
  {
    title: "Expert Review",
    description: "Our experts analyze your issue in detail",
    icon: Search,
  },
  {
    title: "Verification",
    description: "Issue is verified and categorized appropriately",
    icon: UserCheck,
  },
  {
    title: "Resolution",
    description: "Get solutions and recommendations for your issue",
    icon: Send,
  },
];

export function Process() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
