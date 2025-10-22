import Link from "next/link"
import { Twitter, Github, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-lg">FansOnly</span>
            </div>
            <p className="text-primary-foreground/80">
              The new era of fan engagement and creator economy powered by blockchain.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Documentation
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/80 text-sm">© 2025 FansOnly. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <MessageCircle size={20} />
            </Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <Github size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
