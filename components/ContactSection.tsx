import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ContactSection() {
  return (
    <section className="py-16 ">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-blue-900">Contact Us</h2>
            <p className="text-gray-600">
              Get in touch with us for any queries or support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Phone className="h-6 w-6 text-blue-900" />
                  </div>
                  <h3 className="font-semibold">Phone</h3>
                  <div className="space-y-1 text-center">
                    <a
                      href="tel:021-515712"
                      className="text-blue-600 hover:underline block"
                    >
                      021-515712
                    </a>
                    <a
                      href="tel:021-574428"
                      className="text-blue-600 hover:underline block"
                    >
                      021-574428
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Mail className="h-6 w-6 text-blue-900" />
                  </div>
                  <h3 className="font-semibold">Email</h3>
                  <a
                    href="mailto:biratexpo2024@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    biratexpo2024@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-900" />
                  </div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600 text-center">
                    Chamber of Industries Morang
                    <br />
                    Biratnagar, Nepal
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-8">
            <Button
              size="lg"
              className="bg-blue-900 hover:bg-blue-800"
              onClick={() => window.open("https://cim.org.np", "_blank")}
            >
              Visit Our Website
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
