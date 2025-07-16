import Badge from "@/components/atoms/Badge";

const GradeBadge = ({ score, maxScore }) => {
  const percentage = (score / maxScore) * 100;
  const letterGrade = getLetterGrade(percentage);
  
  const getVariant = () => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  return (
    <Badge variant={getVariant()}>
      {letterGrade} ({percentage.toFixed(0)}%)
    </Badge>
  );
};

const getLetterGrade = (percentage) => {
  if (percentage >= 97) return "A+";
  if (percentage >= 93) return "A";
  if (percentage >= 90) return "A-";
  if (percentage >= 87) return "B+";
  if (percentage >= 83) return "B";
  if (percentage >= 80) return "B-";
  if (percentage >= 77) return "C+";
  if (percentage >= 73) return "C";
  if (percentage >= 70) return "C-";
  if (percentage >= 67) return "D+";
  if (percentage >= 65) return "D";
  return "F";
};

export default GradeBadge;