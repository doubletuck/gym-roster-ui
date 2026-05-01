import MuiPagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <Box>
      <MuiPagination
        page={currentPage}
        count={totalPages}
        onChange={(_event, page) => onPageChange(page)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
}
