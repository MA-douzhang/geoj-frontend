export const Color = {
  EASY: "#00AF9B",
  MEDIUM: "#FFB800",
  HARD: "#FF2D55",
};

//Content页面
export const problemStatusColor = new Map<string, string>([
  ["已通过", Color.EASY],
  ["尝试过", Color.MEDIUM],
  ["未开始", Color.HARD],
]);
export const problemStatusIcon = new Map<string, any>([
  // ['已通过', <CheckCircleOutlined key='passed'/>],
  // ['尝试过', <CloseCircleOutlined key='tried'/>],
  // ['未开始', <MinusCircleOutlined key='noLog'/>]
]);

//LogDetail页面
export const submitStatusText = new Map<number, string>([
  [4, "编译失败"],
  [3, "失败"],
  [2, "通过"],
  [1, "判题中"],
  [0, "等待中"],
]);

export const languageLabel = new Map<string, string>([
  ["java", "Java"],
  ["cpp", "C++"],
  ["javascript", "JavaScript"],
  ["python", "Python"],
]);

export const submitStatusColor = new Map<number, string>([
  [4, Color.MEDIUM],
  [3, Color.HARD],
  [2, Color.EASY],
  [1, Color.MEDIUM],
  [0, Color.MEDIUM],
]);

export const submitStatusIcon = new Map<number, any>([
  [4, "<icon-clock-circle />"],
  [3, "<icon-close-circle />"],
  [2, "<icon-check-circle />"],
  [1, "<icon-clock-circle />"],
  [0, "<icon-clock-circle />"],
]);

export const SUBMIT_STATUS = {
  WAITING: 0,
  RUNNING: 1,
  SUCCEED: 2,
  FAILED: 3,
  CompileError: 4,
};

export const JUDGE_INFO_STATUS = {
  Accepted: { text: `通过`, color: "#00b42a" },
  "Wrong Answer": { text: "答案错误", color: "#f53f3f" },
  "Runtime Error": { text: "运行错误", color: "#f53f3f" },
  "Dangerous Operation": { text: "危险操作", color: "#f53f3f" },
  "Compile Error": { text: "编译错误", color: "#ffb400" },
  "Time Limit Exceeded": { text: "超时", color: "#0fc6c2" },
  "Memory Limit Exceeded": { text: "内存溢出", color: "#ff7d00" },
  "Out Of Memory": { text: "内存不足", color: "#ff7d00" },
  "Output Limit Exceeded": { text: "输出溢出", color: "#ff7d00" },
  "Presentation Error": { text: "展示错误", color: "#0fc6c2" },
  Waiting: { text: "等待中", color: "#168cff" },
  "System Error": { text: "系统错误", color: "#86909c" },
  "Language UnSupported": { text: "语言不支持", color: "#0fc6c2" },
  "Sandbox System Error": { text: "沙箱系统错误", color: "#0fc6c2" },
  Default: { text: "未知错误", color: "#86909c" },
  null: { text: "未知错误", color: "#86909c" },
};
