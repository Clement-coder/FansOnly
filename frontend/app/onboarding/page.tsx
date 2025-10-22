"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, AtSign, MessageSquare, Image as ImageIcon, Rocket, Handshake } from "lucide-react";
import { Input } from "../components/Input"; // Assuming you have an Input component
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    avatar: null,
    role: "",
  });

  const { user, updateUser } = usePrivy();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, avatar: e.target.files![0] }));
    }
  };

  const handleRoleSelect = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleFinish = async () => {
    console.log("Onboarding complete:", formData);
    if (user) {
      try {
        await updateUser({
          metadata: {
            role: formData.role,
            fullName: formData.fullName,
            username: formData.username,
            bio: formData.bio,
            onboardingComplete: true,
          },
        });

        if (formData.role === "Creator") {
          router.push("/dashboard/creator");
        } else if (formData.role === "Fan") {
          router.push("/dashboard/fan");
        }
      } catch (error) {
        console.error("Error updating user metadata:", error);
        // Handle error, maybe show a message to the user
      }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg min-h-[600px] bg-card rounded-2xl shadow-lg border border-border p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-foreground text-center mb-8">
          {step === 1 ? "Setup Your Profile" : "Choose Your Role"}
        </h2>

        <AnimatePresence initial={false} mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              custom={1} // Direction for slide
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="w-full px-8" // Removed absolute and top-24
            >
              <div className="space-y-6">
                <Input
                  icon={<User size={20} className="text-muted-foreground" />}
                  placeholder="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <Input
                  icon={<AtSign size={20} className="text-muted-foreground" />}
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <Input
                  icon={<MessageSquare size={20} className="text-muted-foreground" />}
                  placeholder="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  isTextArea
                />
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                    {formData.avatar ? (
                      <img
                        src={URL.createObjectURL(formData.avatar)}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={30} className="text-muted-foreground" />
                    )}
                  </div>
                  <label className="flex-grow px-4 py-2 bg-secondary text-foreground rounded-full font-medium cursor-pointer hover:bg-secondary-dark transition-colors text-center">
                    Upload Avatar
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                  </label>
                </div>
                <motion.button
                  onClick={handleContinue}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={-1} // Direction for slide
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="w-full px-8" // Removed absolute and top-24
            >
              <div className="space-y-6">
                <motion.div
                  className={`p-6 rounded-2xl border-2 ${
                    formData.role === "Creator" ? "border-primary shadow-primary-glow" : "border-border"
                  } bg-background hover:shadow-lg transition-all cursor-pointer`}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
                  onClick={() => handleRoleSelect("Creator")}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                      <Rocket size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Creator</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Build campaigns, engage fans, and distribute rewards.
                  </p>
                </motion.div>

                <motion.div
                  className={`p-6 rounded-2xl border-2 ${
                    formData.role === "Fan" ? "border-primary shadow-primary-glow" : "border-border"
                  } bg-background hover:shadow-lg transition-all cursor-pointer`}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
                  onClick={() => handleRoleSelect("Fan")}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                      <Handshake size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Fan</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Discover creators, join campaigns, and earn exclusive rewards.
                  </p>
                </motion.div>

                <motion.button
                  onClick={handleFinish}
                  disabled={!formData.role}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Finish
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}