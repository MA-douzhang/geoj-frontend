export const Color = {
  EASY: "#00AF9B",
  MEDIUM: "#FFB800",
  HARD: "#FF2D55",
  DEFAULT: "#168cff",
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
  [4, "icon-warning-circle"],
  [3, "icon-close-circle"],
  [2, "icon-check-circle"],
  [1, "icon-reloadtime"],
  [0, "icon-reloadtime"],
]);

export const SUBMIT_STATUS = {
  WAITING: 0,
  RUNNING: 1,
  SUCCEED: 2,
  FAILED: 3,
  CompileError: 4,
};
//Content页面
export const tagsObjectList = new Map<string, string>([
  ["default", Color.DEFAULT],
  ["简单", Color.EASY],
  ["中等", Color.MEDIUM],
  ["困难", Color.HARD],
]);

export const JUDGE_INFO_STATUS = {
  Accepted: { text: `通过`, color: "#00b42a", name: "Accepted" },
  "Wrong Answer": { text: "答案错误", color: "#f53f3f", name: "Wrong Answer" },
  "Runtime Error": {
    text: "运行错误",
    color: "#f53f3f",
    name: "Runtime Error",
  },
  "Dangerous Operation": {
    text: "危险操作",
    color: "#f53f3f",
    name: "Dangerous Operation",
  },
  "Compile Error": {
    text: "编译错误",
    color: "#ffb400",
    name: "Compile Error",
  },
  "Time Limit Exceeded": {
    text: "超时",
    color: "#0fc6c2",
    name: "Time Limit Exceeded",
  },
  "Memory Limit Exceeded": {
    text: "内存溢出",
    color: "#ff7d00",
    name: "Memory Limit Exceeded",
  },
  "Out Of Memory": {
    text: "内存不足",
    color: "#ff7d00",
    name: "Out Of Memory",
  },
  "Output Limit Exceeded": {
    text: "输出溢出",
    color: "#ff7d00",
    name: "Output Limit Exceeded",
  },
  "Presentation Error": {
    text: "展示错误",
    color: "#0fc6c2",
    name: "Presentation Error",
  },
  Waiting: { text: "等待中", color: "#168cff", name: "Waiting" },
  "System Error": { text: "系统错误", color: "#86909c", name: "System Error" },
  "Language UnSupported": {
    text: "语言不支持",
    color: "#0fc6c2",
    name: "Language UnSupported",
  },
  "Sandbox System Error": {
    text: "沙箱系统错误",
    color: "#0fc6c2",
    name: "Sandbox System Error",
  },
  Default: { text: "未知错误", color: "#86909c", name: "Default" },
  null: { text: "未知错误", color: "#86909c", name: "null" },
};
