import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Settings } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <Card className="border border-destructive/30 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-10 px-6">
        <div className="bg-destructive/10 p-3 rounded-full mb-4">
          <Settings size={28} className="text-destructive" />
        </div>
        <CardTitle className="text-destructive mb-2 text-center">
          Không thể tải dữ liệu
        </CardTitle>
        <CardDescription className="text-center mb-4">{error}</CardDescription>
        <Button
          variant="outline"
          className="border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
