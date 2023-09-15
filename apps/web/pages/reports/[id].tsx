import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

const AttendanceReportPage: FunctionComponent = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Report for {id}</h1>
    </div>
  );
};

export default AttendanceReportPage;
