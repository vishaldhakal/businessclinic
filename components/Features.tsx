import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, FileSearch, Shield, Users } from "lucide-react";

const features = [
  {
    title: "Easy Issue Registration",
    description:
      "Simple and straightforward process to register your business issues",
    icon: ClipboardList,
  },
  {
    title: "Expert Analysis",
    description: "Get your issues analyzed by industry experts",
    icon: FileSearch,
  },
  {
    title: "Confidential",
    description: "Your business information is kept secure and confidential",
    icon: Shield,
  },
  {
    title: "Dedicated Support",
    description: "Get support from our dedicated team of professionals",
    icon: Users,
  },
];

export function Features() {
  return (
    <div className="container py-20">
      <h2 className="text-3xl font-bold text-center mb-12">How We Help</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="w-10 h-10 mb-4" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
