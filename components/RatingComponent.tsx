import { useState } from "react";
import { Star, StarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "./ui/dialog";
import toast from "react-hot-toast";

interface RatingComponentProps {
  orderId: string;
  mealId: string;
  mealName: string;
  onRatingSubmit: (rating: number, comment: string, mealId: string, orderId: string) => Promise<void>;
  isDelivered: boolean;
}

export default function RatingComponent({
  orderId,
  mealId,
  mealName,
  onRatingSubmit,
  isDelivered,
}: RatingComponentProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating: number) => {
    setHoveredRating(hoveredRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      await onRatingSubmit(rating, comment, mealId, orderId);
      toast.success("Thank you for your feedback!");
      setIsOpen(false);
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDelivered) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-[10px] h-6">
          Rate Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium mb-1">{mealName}</h3>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={() => handleRatingHover(0)}
                  className="focus:outline-none"
                >
                  {(hoveredRating || rating) >= star ? (
                    <StarIcon className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <Star className="h-6 w-6 text-gray-300" />
                  )}
                </button>
              ))}
              <span className="text-sm ml-2">
                {rating > 0 ? `${rating}/5` : "Select rating"}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="text-sm font-medium">
              Comment (optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this meal..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting} size="sm">
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 