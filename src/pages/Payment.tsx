import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  CreditCard,
  Shield,
  Check,
  Lock,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import type { AppDispatch, RootState } from "../store/store";
import { getCourse } from "../store/slices/courseSlice";
import { enrollInCourse } from "../store/slices/enrollmentSlice";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import placeholderImage from "../assets/course-placeholder.svg";

type PaymentMethod = "card" | "paypal" | "applepay";

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    currentCourse: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useSelector((state: RootState) => state.course);

  const { isLoading: enrollmentLoading } = useSelector(
    (state: RootState) => state.enroll
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  useEffect(() => {
    if (courseId) {
      dispatch(getCourse(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/payment/${courseId}`);
    }
  }, [isAuthenticated, courseId, navigate]);

  if (!courseId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Invalid course ID</p>
          <Button onClick={() => navigate("/browse")}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course || courseError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Course not found</p>
          <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  if (course.price === 0 || !course.price) {
    navigate(`/courses/${course._id}`);
    return null;
  }

  const originalPrice = course.price || 0;
  const discountedPrice =
    originalPrice - (originalPrice * appliedDiscount) / 100;
  const tax = discountedPrice * 0.1;
  const total = discountedPrice + tax;

  const getInstructorName = () => {
    if (typeof course.instructor === "string") return "Unknown Instructor";
    return `${course.instructor.firstName} ${course.instructor.lastName}`;
  };

  const courseThumbnail = course.thumbnail?.url || placeholderImage;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "learn20") {
      setAppliedDiscount(20);
      toast.success("Coupon applied! 20% discount");
    } else if (couponCode.toLowerCase() === "save10") {
      setAppliedDiscount(10);
      toast.success("Coupon applied! 10% discount");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === "card") {
      if (!cardName || !cardNumber || !expiryDate || !cvv) {
        toast.error("Please fill in all card details");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Invalid card number");
        return;
      }
      if (cvv.length < 3) {
        toast.error("Invalid CVV");
        return;
      }
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await dispatch(enrollInCourse(course._id)).unwrap();

      toast.success("Payment successful! Welcome to the course");

      navigate(`/courses/${course._id}`);
    } catch (error: any) {
      toast.error(error || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to course</span>
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Complete your purchase
              </h1>
              <p className="text-muted-foreground">
                Secure checkout powered by industry-standard encryption
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-foreground mb-4">
                Payment Method
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "paypal", label: "PayPal", icon: null },
                  { id: "applepay", label: "Apple Pay", icon: null },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 transition-all duration-200",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {paymentMethod === method.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className="text-center">
                      {method.icon && (
                        <method.icon className="h-6 w-6 mx-auto mb-2 text-foreground" />
                      )}
                      {method.id === "paypal" && (
                        <span className="text-xl font-bold text-[#003087]">
                          Pay<span className="text-[#009cde]">Pal</span>
                        </span>
                      )}
                      {method.id === "applepay" && (
                        <span className="text-xl font-medium text-foreground">
                          {" "}
                          Pay
                        </span>
                      )}
                      {method.icon && (
                        <span className="text-sm font-medium text-foreground">
                          {method.label}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <Label
                      htmlFor="cardName"
                      className="text-sm font-medium text-foreground"
                    >
                      Cardholder Name
                    </Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="cardNumber"
                      className="text-sm font-medium text-foreground"
                    >
                      Card Number
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        maxLength={19}
                        className="pr-12"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="expiry"
                        className="text-sm font-medium text-foreground"
                      >
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) =>
                          setExpiryDate(formatExpiryDate(e.target.value))
                        }
                        maxLength={5}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="cvv"
                        className="text-sm font-medium text-foreground"
                      >
                        CVV
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 4)
                            )
                          }
                          maxLength={4}
                          type="password"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="text-center py-8 animate-fade-in">
                  <p className="text-muted-foreground mb-4">
                    You'll be redirected to PayPal to complete your payment
                  </p>
                </div>
              )}

              {paymentMethod === "applepay" && (
                <div className="text-center py-8 animate-fade-in">
                  <p className="text-muted-foreground mb-4">
                    Click below to pay with Apple Pay
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 py-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span className="text-sm">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="h-5 w-5" />
                <span className="text-sm">256-bit Encryption</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-8">
              <h2 className="font-semibold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="flex gap-4 mb-6">
                <img
                  src={courseThumbnail}
                  alt={course.title}
                  className="w-20 h-14 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm line-clamp-2">
                    {course.title}
                  </h3>
                  {/* ✅ UPDATED: Use instructor name helper */}
                  <p className="text-xs text-muted-foreground mt-1">
                    by {getInstructorName()}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-4">
                <Label className="text-sm font-medium text-foreground">
                  Coupon Code
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Try: LEARN20 or SAVE10
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original Price</span>
                  <span className="text-foreground">
                    ${originalPrice.toFixed(2)}
                  </span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-success">
                      Discount ({appliedDiscount}%)
                    </span>
                    <span className="text-success">
                      -${((originalPrice * appliedDiscount) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full mt-6 h-12 text-base gap-2"
                onClick={handlePayment}
                disabled={isProcessing || enrollmentLoading}
              >
                {isProcessing || enrollmentLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Pay ${total.toFixed(2)}
                  </>
                )}
              </Button>

              <div className="mt-4 p-3 bg-success/10 rounded-lg">
                <p className="text-xs text-success text-center">
                  30-day money-back guarantee. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
