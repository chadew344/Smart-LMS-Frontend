import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { verifyPayment } from "../store/slices/enrollmentSlice";
import { useAppDispatch } from "../store/hook";
import { Button } from "../components/ui/button";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      navigate("/");
      return;
    }

    const verify = async () => {
      try {
        const enrollment = await dispatch(verifyPayment(sessionId)).unwrap();
        setIsVerifying(false);

        const courseId =
          typeof enrollment.course === "string"
            ? enrollment.course
            : enrollment.course._id;

        setTimeout(() => {
          navigate(`/courses/${courseId}`);
        }, 2000);
      } catch (err: any) {
        setError(err);
        setIsVerifying(false);
      }
    };

    verify();
  }, [searchParams, dispatch, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p>Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-4">
          Redirecting to your course...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
