import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { Quote, Star, Send } from "lucide-react";
import { db } from '@/lib/firebase';
import { ref, push, onValue } from 'firebase/database';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  timestamp: number;
  image?: string;
  roleType?: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ name: '', content: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [isSubmissionEnabled, setIsSubmissionEnabled] = useState(true);

  useEffect(() => {
    // Listen for reviews
    const reviewsRef = ref(db, 'reviews');
    const unsubscribeReviews = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        // Sort by timestamp desc
        list.sort((a, b) => b.timestamp - a.timestamp);
        setReviews(list);
      } else {
        setReviews([]);
      }
      setLoading(false);
    });

    // Listen for settings
    const settingsRef = ref(db, 'settings/reviews');
    const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.publicSubmission !== undefined) {
        setIsSubmissionEnabled(data.publicSubmission);
      }
    });

    return () => {
      unsubscribeReviews();
      unsubscribeSettings();
    };
  }, []);

  const fetchIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (e) {
      return 'Unknown IP';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!newReview.name.trim() || !newReview.content.trim()) {
        toast.error("Please fill in all fields");
        setSubmitting(false);
        return;
      }

      const ip = await fetchIp();
      const userAgent = navigator.userAgent;

      const reviewData = {
        name: newReview.name,
        content: newReview.content,
        rating: newReview.rating,
        role: 'User Review',
        timestamp: Date.now(),
        ip: ip,
        userAgent: userAgent
      };

      await push(ref(db, 'reviews'), reviewData);

      toast.success("Thank you for your review!");
      setNewReview({ name: '', content: '', rating: 5 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Reviews | Interman"
        description="Read what our students and parents say about Interman Educational Services. We pride ourselves on the success of our candidates."
      />
      <Navbar />
      <main>
        <PageHeader title="REVIEWS" breadcrumb="Reviews" />

        <section className="py-24 bg-background relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="section-title">
                HAPPY CLIENTS
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                Our success is measured by the satisfaction of our students. Here's what they have to say about their journey with us.
              </p>
            </motion.div>

            {/* Reviews Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-muted/20 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {reviews.map((review, index) => (
                  <div key={review.id} className="break-inside-avoid">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="glass-card p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/20 relative group"
                    >
                      <Quote className="absolute top-8 right-8 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" fill="currentColor" />

                      <div className="flex items-center gap-4 mb-6">
                        {review.image ? (
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0">
                            <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-foreground leading-tight">{review.name}</h3>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{review.role || "Student"}</p>
                          <div className="flex text-secondary gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-secondary" : "text-muted-foreground/30"} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          "{review.content}"
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                          Verified Review
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(review.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Review Form */}
            <AnimatePresence>
              {isSubmissionEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-24 max-w-3xl mx-auto"
                >
                  <div className="glass-card p-8 md:p-12 rounded-3xl shadow-xl border-t-4 border-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-10 -mt-10" />

                    <div className="text-center mb-8 relative z-10">
                      <h3 className="text-2xl font-bold font-display text-foreground mb-2">Share Your Experience</h3>
                      <p className="text-muted-foreground">Your feedback helps us improve and inspires others.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">Your Name</label>
                          <Input
                            placeholder="John Doe"
                            value={newReview.name}
                            onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                            required
                            className="bg-white/50 border-white/20 focus:bg-white transition-all rounded-xl py-6"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">Your Rating</label>
                          <div className="flex gap-1 bg-white/50 border border-white/20 rounded-xl p-3 justify-center items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className={`text-2xl transition-all hover:scale-125 focus:outline-none px-1 ${star <= newReview.rating ? 'text-secondary' : 'text-muted-foreground/30'}`}
                              >
                                <Star fill={star <= newReview.rating ? "currentColor" : "none"} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Your Review</label>
                        <Textarea
                          placeholder="Tell us about your experience with Interman..."
                          value={newReview.content}
                          onChange={e => setNewReview({ ...newReview, content: e.target.value })}
                          required
                          className="min-h-[150px] bg-white/50 border-white/20 focus:bg-white transition-all rounded-xl resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all rounded-xl"
                        disabled={submitting}
                      >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                        {!submitting && <Send size={18} className="ml-2" />}
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Reviews;
