import { getRepositoryById } from "@/src/services/repository.service";
import { getLanguageStats } from "@/src/services/language.service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CommitsList } from "./commits-list";
import { 
  ArrowLeft, 
  Star, 
  GitFork, 
  GitCommit, 
  ExternalLink,
  Info,
  Calendar,
  Code
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export default async function RepositoryDetailsPage(
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  const { repositoryId } = await params;
  
  let repository;
  let languageStats;
  try {
    repository = await getRepositoryById(repositoryId);
    languageStats = await getLanguageStats(repositoryId);
  } catch (error) {
    console.error("Repository Details Error:", error);
    notFound();
  }
  
  const { stats } = repository;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric"
    }).format(new Date(date));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 transition-colors duration-300">
        
        {/* Back Link & Header */}
        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{repository.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                  repository.isPrivate 
                    ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                    : 'bg-green-500/10 text-green-600 border-green-500/20'
                }`}>
                  {repository.isPrivate ? 'Private' : 'Public'}
                </span>
              </div>
              
              {repository.description && (
                <p className="text-muted-foreground text-sm font-semibold max-w-2xl leading-relaxed">{repository.description}</p>
              )}
              
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground/60" />
                <span>Last updated on GitHub: {formatDate(repository.githubUpdatedAt)}</span>
              </div>
            </div>
            
            <a 
              href={`https://github.com/${repository.owner.username}/${repository.name}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start sm:self-center"
            >
              <FaGithub className="w-4 h-4" />
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Grid Stats and Languages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Stats Card */}
          <div className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <h2 className="text-sm font-bold text-foreground tracking-tight mb-4 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-500" />
              <span>Repository Statistics</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-secondary/35 border border-border/20 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stars</span>
                <span className="text-xl font-extrabold text-foreground mt-1 flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" /> {repository.stars}
                </span>
              </div>
              <div className="p-3 bg-secondary/35 border border-border/20 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Forks</span>
                <span className="text-xl font-extrabold text-foreground mt-1 flex items-center gap-1">
                  <GitFork className="w-4 h-4 text-indigo-500" /> {repository.forks}
                </span>
              </div>
              <div className="col-span-2 p-3 bg-secondary/35 border border-border/20 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Commits</span>
                <span className="text-xl font-extrabold text-foreground flex items-center gap-1">
                  <GitCommit className="w-4 h-4 text-violet-500" /> {stats?.totalCommits || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Languages Card */}
          <div className="md:col-span-2 bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <h2 className="text-sm font-bold text-foreground tracking-tight mb-4 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-violet-500" />
              <span>Language Distribution</span>
            </h2>
            
            {languageStats.languages.length === 0 ? (
              <p className="text-sm text-muted-foreground font-semibold py-6">No language distribution data synced.</p>
            ) : (
              <div className="space-y-6">
                {/* Visual Bar */}
                <div className="flex h-3 rounded-full overflow-hidden bg-secondary border border-border/30">
                  {languageStats.languages.map((lang, idx) => {
                    const colors = [
                      'bg-indigo-500', 
                      'bg-violet-500', 
                      'bg-amber-400', 
                      'bg-emerald-500', 
                      'bg-pink-500', 
                      'bg-sky-400'
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <div 
                        key={lang.name} 
                        className={`h-full ${color}`} 
                        style={{ width: `${lang.percentage}%` }}
                        title={`${lang.name}: ${lang.percentage}%`}
                      />
                    );
                  })}
                </div>
                
                {/* Legend List */}
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {languageStats.languages.map((lang, idx) => {
                    const colors = [
                      'bg-indigo-500', 
                      'bg-violet-500', 
                      'bg-amber-400', 
                      'bg-emerald-500', 
                      'bg-pink-500', 
                      'bg-sky-400'
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <div key={lang.name} className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                        <span className="text-xs font-bold text-foreground">{lang.name}</span>
                        <span className="text-[10px] font-semibold text-muted-foreground">{lang.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Commits Section */}
        <div className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
          <div className="p-5 border-b border-border/40">
            <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-indigo-500" />
              <span>Recent Commit History</span>
            </h2>
          </div>
          <CommitsList repositoryId={repositoryId} />
        </div>
      </div>
    );
}
