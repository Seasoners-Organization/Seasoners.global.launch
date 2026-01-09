"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

const completionTasks = [
  {
    id: 'picture',
    label: 'Profile Picture',
    description: 'Add a clear, friendly photo',
    icon: '',
    priority: 'high',
    impact: 15,
    action: 'upload',
  },
  {
    id: 'email',
    label: 'Verify Email',
    description: 'Confirm your email address',
    icon: '',
    priority: 'high',
    impact: 10,
    action: 'verify',
  },
  {
    id: 'phone',
    label: 'Verify Phone',
    description: 'Add & verify your phone number',
    icon: '',
    priority: 'high',
    impact: 10,
    action: 'verify',
  },
  {
    id: 'bio',
    label: 'Write a Bio',
    description: '50+ characters about yourself',
    icon: '',
    priority: 'high',
    impact: 15,
    action: 'edit',
  },
  {
    id: 'languages',
    label: 'Add Languages',
    description: 'Languages you speak',
    icon: '',
    priority: 'medium',
    impact: 10,
    action: 'edit',
  },
  {
    id: 'skills',
    label: 'List Skills',
    description: 'Professional or personal skills',
    icon: '',
    priority: 'medium',
    impact: 10,
    action: 'edit',
  },
  {
    id: 'interests',
    label: 'Share Interests',
    description: 'Hobbies & things you enjoy',
    icon: '',
    priority: 'medium',
    impact: 10,
    action: 'edit',
  },
  {
    id: 'regions',
    label: 'Preferred Regions',
    description: 'Where you want to work/live',
    icon: '',
    priority: 'low',
    impact: 5,
    action: 'edit',
  },
];

export default function ProfileCompletenessRoadmap({ user, onNavigate }) {
  const [expandedId, setExpandedId] = useState(null);

  // Determine completion status for each task
  const getTaskStatus = (task) => {
    switch (task.id) {
      case 'picture':
        return !!user?.profilePicture;
      case 'email':
        return !!user?.emailVerified;
      case 'phone':
        return !!user?.phoneVerified;
      case 'bio':
        return !!user?.aboutMe && user.aboutMe.length >= 50;
      case 'languages':
        return !!user?.spokenLanguages && user.spokenLanguages.length > 0;
      case 'skills':
        return !!user?.skills && user.skills.length > 0;
      case 'interests':
        return !!user?.interests && user.interests.length > 0;
      case 'regions':
        return !!user?.preferredRegions && user.preferredRegions.length > 0;
      default:
        return false;
    }
  };

  const completedTasks = completionTasks.filter(task => getTaskStatus(task)).length;
  const totalImpact = completionTasks.reduce((acc, task) => acc + task.impact, 0);
  const completedImpact = completionTasks
    .filter(task => getTaskStatus(task))
    .reduce((acc, task) => acc + task.impact, 0);

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTasks = [...completionTasks].sort((a, b) => {
    // Incomplete tasks first, sorted by priority
    const aComplete = getTaskStatus(a);
    const bComplete = getTaskStatus(b);
    if (aComplete !== bComplete) return aComplete ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleTaskClick = (task) => {
    if (onNavigate) {
      onNavigate(task.id, task.action);
    }
    setExpandedId(expandedId === task.id ? null : task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200 p-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Complete Your Profile</h3>
        <p className="text-slate-600 text-sm mb-4">
          Finish these tasks to boost your trust score and stand out to other users
        </p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              {completedTasks}/{completionTasks.length} completed
            </span>
            <span className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full font-medium">
              +{completedImpact}/{totalImpact} trust impact
            </span>
          </div>
          <div className="w-full bg-sky-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks / completionTasks.length) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {sortedTasks.map((task, index) => {
          const isComplete = getTaskStatus(task);
          const isExpanded = expandedId === task.id;

          return (
            <motion.button
              key={task.id}
              onClick={() => handleTaskClick(task)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                isComplete
                  ? 'bg-emerald-50 border-emerald-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-slate-900 flex items-center gap-2">
                      {task.label}
                      {isComplete && (
                        <span className="text-emerald-600 text-lg">✓</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600">
                      {task.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    +{task.impact}
                  </span>
                  <span className={`text-sm ${isExpanded ? 'text-sky-600' : 'text-slate-400'}`}>
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && !isComplete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-slate-200"
                >
                  <p className="text-xs text-slate-600 mb-2">
                    This helps because: Higher-quality profiles get more messages and interactions.
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task);
                    }}
                    className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded font-medium hover:bg-sky-700 transition-colors"
                  >
                    Complete this now →
                  </button>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedTasks === completionTasks.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg text-center"
        >
          <p className="font-bold text-emerald-900">Profile Complete!</p>
          <p className="text-sm text-emerald-700">
            You've maximized your profile. Keep it up to date!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
