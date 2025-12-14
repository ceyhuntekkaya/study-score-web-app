"use client";

import Header from "./components/header";
import Footer from "./components/footer";
import Questions1To4Section from "./sections/questions-1-to-4-section";
import Questions5To8Section from "./sections/questions-5-to-8-section";
import Questions9To13Section from "./sections/questions-9-to-13-section";

export default function ReadingPage() {
  const handleSubmit = () => {
    // Handle test submission
    console.log("Reading test submitted");
    // You can add navigation or other logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSubmit={handleSubmit} />

      {/* Main Content Area */}
      <div className="p-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Reading Passage */}
            <div className="bg-white rounded-2xl shadow p-6">
              {/* Part 1 Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-1">
                  PART 1
                </h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  READING PASSAGE 1
                </h2>
                <p className="text-gray-600 text-sm">
                  You should spend about 20 minutes on Questions 1-13, which are
                  based on Reading Passage 1 below.
                </p>
              </div>

              {/* Mobile Money Transfer Illustration */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center">
                  {/* Smartphone */}
                  <div className="w-24 h-40 bg-gray-800 rounded-2xl relative">
                    <div className="absolute inset-1 bg-gray-700 rounded-xl"></div>
                    {/* Screen content */}
                    <div className="absolute inset-2 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="text-blue-600 text-xs font-bold">
                        M-Pesa
                      </div>
                    </div>
                  </div>

                  {/* Floating icons */}
                  <div className="absolute -left-4 top-8 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
                    </svg>
                  </div>

                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">$</span>
                  </div>

                  <div className="absolute -right-4 top-8 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>

                  <div className="absolute -right-4 top-20 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Reading Passage Banner */}
              <div className="bg-teal-500 text-white px-4 py-2 rounded-lg mb-6">
                <div className="text-center">
                  <div className="font-semibold">Reading Passage 1</div>
                  <div className="text-sm opacity-90">
                    Money Transfers by Mobile
                  </div>
                </div>
              </div>

              {/* Reading Passage Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Money Transfers by Mobile
              </h3>

              {/* Reading Passage Text */}
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Paragraph A
                  </p>
                  <p>
                    The ping of a text message has never sounded so sweet. In
                    what is being touted as a world first, Kenya&#39;s biggest
                    mobile operator is allowing subscribers to send cash to
                    other phone users by SMS. Known as M-Pesa, or mobile money,
                    the service is expected to revolutionise banking in a
                    country where more than 80% of people are excluded from the
                    formal financial sector. Apart from transferring cash - a
                    service much in demand among urban Kenyans supporting
                    relatives in rural areas - customers of the Safaricom
                    network will be able to keep up to 50,000 shillings (£370)
                    in a &quot;virtual account&quot; on their handsets.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Paragraph B
                  </p>
                  <p>
                    Developed by Vodafone, which holds a 35% share in Safaricom,
                    M-Pesa was formally launched in Kenya two weeks ago. The
                    service allows users to deposit money into their mobile
                    phone accounts and then transfer it to other users via text
                    message. Recipients can then withdraw the money from
                    designated agents, such as mobile phone shops or petrol
                    stations, by showing their phone and entering a PIN code.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Paragraph C
                  </p>
                  <p>
                    The system is particularly useful in a country where many
                    people live in rural areas far from banks and where
                    traditional banking services are expensive and often
                    inaccessible. M-Pesa charges a small fee for each
                    transaction, but this is significantly lower than the fees
                    charged by traditional money transfer services or banks. The
                    service has already attracted over 100,000 users in its
                    first month of operation.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Paragraph D
                  </p>
                  <p>
                    Security concerns have been raised about the system,
                    particularly regarding the PIN codes and the potential for
                    fraud. However, Vodafone has implemented several security
                    measures, including encryption of all transactions and the
                    ability to block accounts immediately if suspicious activity
                    is detected. The company also works closely with local
                    authorities to prevent and investigate any fraudulent
                    activities.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 mb-2">
                    Paragraph E
                  </p>
                  <p>
                    The success of M-Pesa in Kenya has attracted attention from
                    other developing countries looking to improve financial
                    inclusion. Similar services are being developed in Tanzania,
                    Uganda, and Afghanistan, with plans to expand to other
                    regions. The World Bank has praised the initiative as an
                    innovative solution to the challenge of providing financial
                    services to the unbanked population in developing countries.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Questions */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="space-y-8">
                <Questions1To4Section />
                <Questions5To8Section />
                <Questions9To13Section />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
