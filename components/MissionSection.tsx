import { Building2, Target, Puzzle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MissionSection() {
  return (
    <section className="py-2">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Mission Card */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-red-600" />
                <CardTitle className="text-xl text-red-600">Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-gray-600 leading-relaxed">
                Facilitate industries for the smooth operation and productivity
                enhancement through the troubleshooting as well as scale-up
                support with the provision of accessible network of business
                development services.
              </p>
            </CardContent>
          </Card>

          {/* Objective Card */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-red-600" />
                <CardTitle className="text-xl text-red-600">
                  Objective
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>Collection and documentation of industrial issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>Seel/facilitate appropriate solution of issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>Provision of BDS services for scale-up</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Program Component Card */}
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Puzzle className="h-6 w-6 text-red-600" />
                <CardTitle className="text-xl text-red-600">
                  Program Component
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>Regular Industrial Visit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>Implement CIM Policy Advocacy Framework</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>Business Health Checkup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>
                    Create pool of BDS service providers and conduct tailor
                    made/customize scale-up activities
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Partnership Section */}
        <div className="mt-12 space-y-6 text-center">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Partnership</h3>
            <p className="text-gray-600">
              Ministry of Industry Supply and Commerce, Government of Nepal
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold">
              For Further Details Please Contact
            </h3>
            <p className="text-gray-600 space-x-2">
              <a
                href="tel:021-515712"
                className="text-blue-600 hover:underline"
              >
                021-515712
              </a>
              <span>,</span>
              <a
                href="tel:021-574428"
                className="text-blue-600 hover:underline"
              >
                021-574428
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
