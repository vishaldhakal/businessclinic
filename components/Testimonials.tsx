import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "John Smith",
    role: "CEO, Tech Solutions",
    content:
      "The Business Clinic helped us navigate complex regulatory challenges.",
    avatar: "JS",
  },
  {
    name: "Sarah Johnson",
    role: "Founder, StartupX",
    content: "Excellent support and guidance throughout the entire process.",
    avatar: "SJ",
  },
  {
    name: "Mike Brown",
    role: "Director, Manufacturing Co",
    content:
      "Their expertise helped us resolve our business issues efficiently.",
    avatar: "MB",
  },
];

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
