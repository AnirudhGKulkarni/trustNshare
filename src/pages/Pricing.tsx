import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import FrontNavbar from "@/components/FrontNavbar";

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "per user/month",
    description: "Perfect for small teams",
    features: ["Up to 5 users", "5GB storage per user", "Basic encryption", "Email support"],
    cta: "Start Free Trial",
    featured: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "per user/month",
    description: "For growing businesses",
    features: ["Unlimited users", "Unlimited storage", "Military-grade encryption", "Priority support", "Advanced audit logs"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    description: "For large organizations",
    features: ["Everything in Professional", "Custom integrations", "Dedicated support", "SLA guarantee", "On-premises option"],
    cta: "Contact Sales",
    featured: false,
  },
];

const comparisonFeatures = [
  { name: "Users", starter: "Up to 5", professional: "Unlimited", enterprise: "Unlimited" },
  { name: "Storage", starter: "5GB per user", professional: "Unlimited", enterprise: "Unlimited" },
  { name: "Encryption", starter: "Basic AES", professional: "Military-grade", enterprise: "Military-grade" },
  { name: "API Access", starter: "No", professional: "Yes", enterprise: "Yes" },
  { name: "Custom Branding", starter: "No", professional: "Yes", enterprise: "Yes" },
  { name: "SSO/SAML", starter: "No", professional: "Yes", enterprise: "Yes" },
  { name: "Audit Logs", starter: "30 days", professional: "Unlimited", enterprise: "Unlimited" },
  { name: "Support", starter: "Email", professional: "Priority", enterprise: "24/7 Dedicated" },
];

const Pricing: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const bgClass = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const cardBgClass = isDarkMode ? "bg-gray-800" : "bg-white";

  return (
    <div className={`${bgClass} transition-colors duration-300`}>
      <FrontNavbar isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />

      {/* Hero Section */}
      <section className={`relative w-full py-20 px-6 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700"} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Choose the plan that fits your organization. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className={`py-20 px-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl shadow-lg transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-2 group animate-fade-in border ${
                  plan.featured
                    ? `${isDarkMode ? "bg-gradient-to-br from-blue-600 to-purple-600 scale-105 border-blue-500" : "bg-gradient-to-br from-blue-600 to-purple-700 border-purple-400"} text-white shadow-2xl`
                    : `${cardBgClass} ${isDarkMode ? "border-gray-700 hover:border-blue-500" : "border-gray-200 hover:border-blue-400"}`
                }`}
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="p-8">
                  {plan.featured && (
                    <div className="mb-4 inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`mb-6 text-sm ${plan.featured ? "text-blue-100" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${plan.featured ? "text-white" : ""}`}>{plan.price}</span>
                    <span className={`text-sm ml-2 ${plan.featured ? "text-blue-100" : isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {plan.period}
                    </span>
                  </div>
                  <button
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform mb-8 hover:scale-105 active:scale-95 shadow-lg ${
                      plan.featured
                        ? "bg-white text-blue-600 hover:bg-gray-100 hover:shadow-xl"
                        : isDarkMode
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                    }`}
                  >
                    {plan.cta}
                  </button>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 transition-transform duration-300 group hover:translate-x-1">
                        <CheckCircle className={`w-5 h-5 flex-shrink-0 ${plan.featured ? "text-blue-200" : "text-green-600"}`} />
                        <span className={plan.featured ? "text-blue-50" : ""}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center p-8 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${isDarkMode ? "bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-blue-500" : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-blue-400"}`}>
            <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Need a Custom Plan?</h3>
            <p className={`mb-6 text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Contact our sales team to discuss custom pricing and features tailored to your organization's needs.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
              Contact Sales Team
            </button>
          </div>
        </div>
      </section>

      {/* Features Comparison Section */}
      <section className={`py-20 px-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 animate-fade-in ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Detailed Feature Comparison
          </h2>

          <div className={`overflow-x-auto rounded-2xl shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <table className={`w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-50"}`}>
                  <th className={`px-6 py-4 text-left font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Feature</th>
                  <th className={`px-6 py-4 text-center font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Starter</th>
                  <th className={`px-6 py-4 text-center font-bold text-blue-600`}>Professional</th>
                  <th className={`px-6 py-4 text-center font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr
                    key={idx}
                    className={`border-b transition-all duration-300 group hover:scale-x-105 ${isDarkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-100 hover:bg-blue-50"}`}
                  >
                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {feature.name}
                    </td>
                    <td className={`px-6 py-4 text-center group-hover:scale-110 transition-transform ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {feature.starter}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-600 font-semibold group-hover:scale-110 transition-transform">{feature.professional}</td>
                    <td className={`px-6 py-4 text-center group-hover:scale-110 transition-transform ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      {feature.enterprise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 px-6 ${bgClass}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 animate-fade-in ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
              },
              {
                question: "Do you offer discounts for annual billing?",
                answer: "Yes, we offer 20% discount when you pay annually. Contact our sales team to learn more.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, wire transfers, and popular digital payment methods.",
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, all plans come with a 14-day free trial. No credit card is required to start.",
              },
              {
                question: "What happens after my free trial ends?",
                answer: "Your trial will end and you'll need to choose a plan to continue. You won't be charged until you explicitly choose a plan.",
              },
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time. We don't have long-term contracts.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border group hover:-translate-y-1 animate-fade-in ${isDarkMode ? "bg-gray-800 border-gray-700 hover:border-blue-500" : "bg-white border-gray-200 hover:border-blue-400"}`}
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <h3 className={`text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {faq.question}
                </h3>
                <p className={isDarkMode ? "text-gray-300 leading-relaxed" : "text-gray-700 leading-relaxed"}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-6 ${isDarkMode ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gradient-to-r from-blue-600 to-purple-700"} text-white overflow-hidden relative`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations protecting their data with SecureShare. Start your free 14-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm text-lg">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDarkMode ? "bg-gray-900" : "bg-gray-900"} text-white py-16 px-6`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">SecureShare</span>
            </div>
            <p className="text-gray-400 text-sm">Enterprise-grade file sharing with military-grade encryption and complete compliance.</p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-6">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Blog & Articles</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Security Reports</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">API Reference</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Contact Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">System Status</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Send Feedback</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Press Kit</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Trust Center</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: "f", label: "Facebook" },
                { icon: "in", label: "LinkedIn" },
                { icon: "𝕏", label: "Twitter" },
                { icon: "📷", label: "Instagram" }
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  title={social.label}
                  className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:border-blue-400 hover:text-blue-400 transition text-gray-400"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Language Selector - Indian Languages */}
            <select className="bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white text-sm hover:border-gray-500 transition">
              <option>हिंदी (Hindi)</option>
              <option>తెలుగు (Telugu)</option>
              <option>தமிழ் (Tamil)</option>
              <option>ಕನ್ನಡ (Kannada)</option>
              <option>മലയാളം (Malayalam)</option>
              <option>मराठी (Marathi)</option>
              <option>বাংলা (Bengali)</option>
              <option>ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-6">
            <div className="flex gap-6 text-center md:text-left">
              <a href="#" className="hover:text-blue-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition">Security</a>
              <a href="#" className="hover:text-blue-400 transition">Compliance</a>
            </div>
            <p>© 2025 SecureShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
