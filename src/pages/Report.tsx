import { useState } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { useAppSelector } from "../store/hook";
import { toast } from "sonner";
import { USER_ROLES } from "../types";
import { generatePDF, type PDFColumn, type PDFData } from "../lib/pdfGenerator";

interface ReportOption {
  id: string;
  label: string;
  description: string;
  format: "pdf" | "csv" | "xlsx";
}

const studentReports: ReportOption[] = [
  {
    id: "progress",
    label: "My Progress Report",
    description: "Complete overview of your learning journey",
    format: "pdf",
  },
  {
    id: "transcript",
    label: "Course Transcript",
    description: "Official transcript of completed courses",
    format: "pdf",
  },
  {
    id: "certificates",
    label: "Certificates",
    description: "Download all earned certificates",
    format: "pdf",
  },
  {
    id: "activity",
    label: "Activity Log",
    description: "Detailed activity and engagement history",
    format: "csv",
  },
];

const instructorReports: ReportOption[] = [
  {
    id: "earnings",
    label: "Earnings Report",
    description: "Revenue breakdown and payment history",
    format: "pdf",
  },
  {
    id: "students",
    label: "Student Analytics",
    description: "Detailed student performance data",
    format: "csv",
  },
  {
    id: "performance",
    label: "Course Performance",
    description: "Engagement metrics for all courses",
    format: "xlsx",
  },
  {
    id: "reviews",
    label: "Reviews Summary",
    description: "Student feedback and ratings",
    format: "pdf",
  },
];

const adminReports: ReportOption[] = [
  {
    id: "platform",
    label: "Platform Report",
    description: "Overall platform health and metrics",
    format: "pdf",
  },
  {
    id: "users",
    label: "User Export",
    description: "Complete user database export",
    format: "csv",
  },
  {
    id: "revenue",
    label: "Revenue Report",
    description: "Financial overview and projections",
    format: "xlsx",
  },
  {
    id: "audit",
    label: "Audit Log",
    description: "Security and access audit trail",
    format: "csv",
  },
  {
    id: "courses",
    label: "Courses Report",
    description: "All courses with performance data",
    format: "xlsx",
  },
];

export const Reports = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const { activeRole } = useAppSelector((state) => state.auth);

  const getReportsForRole = () => {
    switch (activeRole) {
      case USER_ROLES.ADMIN:
        return adminReports;
      case USER_ROLES.INSTRUCTOR:
        return instructorReports;
      default:
        return studentReports;
    }
  };

  const reports = getReportsForRole();

  const handleDownload = async (report: ReportOption) => {
    setDownloading(report.id);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (report.format === "pdf") {
      const data: PDFData[] = [
        {
          id: "S001",
          name: "Kasun Perera",
          role: "Student",
          course: "Software Engineering",
          progress: "85%",
        },
        {
          id: "S002",
          name: "Amara Silva",
          role: "Student",
          course: "Data Science",
          progress: "40%",
        },
      ];

      const columns: PDFColumn[] = [
        { title: "ID", dataKey: "id" },
        { title: "Name", dataKey: "name" },
        { title: "Role", dataKey: "role" },
        { title: "Course", dataKey: "course" },
        { title: "Progress", dataKey: "progress", align: "right" },
      ];

      generatePDF({
        title: report.label,
        subtitle: report.description,
        columns,
        data,
        fileName: `${report.label}.pdf`,
      });
    } else {
      toast.success(`Download for ${report.format} not implemented yet.`, {
        description: `${report.label}.${report.format}`,
      });
    }

    toast.success(`${report.label} downloaded successfully!`, {
      description: `${report.label}.${report.format}`,
    });
    setDownloading(null);
  };

  const getIcon = (format: string) => {
    switch (format) {
      case "csv":
      case "xlsx":
        return FileSpreadsheet;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
          Reports
        </h1>
        <p className="text-muted-foreground">
          Download and export your reports
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => {
          const Icon = getIcon(report.format);
          const isDownloading = downloading === report.id;

          return (
            <button
              key={report.id}
              onClick={() => handleDownload(report)}
              disabled={isDownloading}
              className="bg-card rounded-xl p-6 shadow-card border border-border/50 hover:border-primary/50 transition-all text-left group disabled:opacity-60"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    {report.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase font-medium">
                      .{report.format}
                    </span>
                    {isDownloading ? (
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
