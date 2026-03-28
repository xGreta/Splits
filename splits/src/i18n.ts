export type Language = 'en' | 'zh'

type Messages = {
  languageLabel: string
  languageEnglish: string
  languageChinese: string
  eyebrow: string
  heroTitle: string
  heroCopy: string
  flowTitle: string
  flowStepOneTitle: string
  flowStepOneCopy: string
  flowStepTwoTitle: string
  flowStepTwoCopy: string
  flowStepThreeTitle: string
  flowStepThreeCopy: string
  startOver: string
  activitySetup: string
  participantsCount: (count: number) => string
  expensesCount: (count: number) => string
  activityName: string
  activityNamePlaceholder: string
  activityNameRequired: string
  addAtLeastOneParticipant: string
  addParticipant: string
  participantNamePlaceholder: string
  add: string
  participantNameRequired: string
  participantUsedError: string
  noParticipants: string
  noParticipantsCopy: string
  participantTableName: string
  participantTableStatus: string
  participantTableActions: string
  participantStatusReady: string
  addExpense: string
  editExpense: string
  description: string
  descriptionPlaceholder: string
  descriptionRequired: string
  amount: string
  amountPlaceholder: string
  positiveAmountRequired: string
  payer: string
  selectPayer: string
  validPayerRequired: string
  shareQuestion: string
  addParticipantsFirst: string
  selectAtLeastOneParticipant: string
  invalidParticipantsSelected: string
  equalSharePreview: string
  enterAmountAndParticipants: string
  cancelEdit: string
  saveChanges: string
  expenseReview: string
  totalWithAmount: (amount: string) => string
  noExpenses: string
  noExpensesCopy: string
  expenseTableDescription: string
  expenseTableAmount: string
  expenseTablePayer: string
  expenseTableSharedBy: string
  expenseTableShare: string
  expenseTableActions: string
  edit: string
  delete: string
  summary: string
  paidVsOwed: string
  addParticipantsToSeeSummary: string
  summaryTableParticipant: string
  summaryTablePaid: string
  summaryTableOwed: string
  summaryTableNet: string
  finalSettlement: string
  suggestedTransfers: string
  addExpensesToCalculate: string
  alreadySettled: string
  pays: string
  importExportShare: string
  browserOnlySharing: string
  importJson: string
  generateShareLink: string
  snapshotLink: string
  autosaveNotice: string
  snapshotNotice: string
  loadedFromShareLink: string
  importedSuccess: (name: string) => string
  importedFailure: string
  shareCopied: string
  shareManualCopy: string
  untitledActivity: string
  unknownParticipant: string
  unnamedParticipant: string
  noParticipantsSelected: string
  each: string
  splitRemainder: (baseCount: number, baseShare: string, remainderCount: number, higherShare: string) => string
}

export const LANGUAGE_STORAGE_KEY = 'splits-language-v2'

export const messages: Record<Language, Messages> = {
  en: {
    languageLabel: 'Language',
    languageEnglish: 'English',
    languageChinese: '中文',
    eyebrow: 'Simple bill splitting for one shared event',
    heroTitle: 'Splits',
    heroCopy: 'Track who paid, who should share each expense, and exactly who should transfer money at the end.',
    flowTitle: 'How To Use',
    flowStepOneTitle: '1. Create activity',
    flowStepOneCopy: 'Enter the activity name and add all participants first.',
    flowStepTwoTitle: '2. Record expenses',
    flowStepTwoCopy: 'Add each payment with payer, amount, and sharing members.',
    flowStepThreeTitle: '3. Review and share',
    flowStepThreeCopy: 'Check the tables, confirm the settlement, then share the link.',
    startOver: 'Start over',
    activitySetup: 'Activity setup',
    participantsCount: (count) => `${count} participants`,
    expensesCount: (count) => `${count} expenses`,
    activityName: 'Activity name',
    activityNamePlaceholder: 'Weekend trip, dinner, birthday party...',
    activityNameRequired: 'Activity name is required.',
    addAtLeastOneParticipant: 'Add at least one participant.',
    addParticipant: 'Add participant',
    participantNamePlaceholder: 'Name',
    add: 'Add',
    participantNameRequired: 'Enter a participant name.',
    participantUsedError: 'Remove or edit expenses using this participant before deleting them.',
    noParticipants: 'No participants yet',
    noParticipantsCopy: 'Add the people involved so you can start entering shared expenses.',
    participantTableName: 'Participant',
    participantTableStatus: 'Status',
    participantTableActions: 'Actions',
    participantStatusReady: 'Ready',
    addExpense: 'Add expense',
    editExpense: 'Edit expense',
    description: 'Description',
    descriptionPlaceholder: 'Dinner, taxi, groceries...',
    descriptionRequired: 'Description is required.',
    amount: 'Amount',
    amountPlaceholder: '0.00',
    positiveAmountRequired: 'Enter a valid positive amount.',
    payer: 'Payer',
    selectPayer: 'Select payer',
    validPayerRequired: 'Choose a valid payer.',
    shareQuestion: 'Who should share this expense?',
    addParticipantsFirst: 'Add participants first.',
    selectAtLeastOneParticipant: 'Select at least one participant.',
    invalidParticipantsSelected: 'One or more selected participants are no longer valid.',
    equalSharePreview: 'Equal share preview:',
    enterAmountAndParticipants: 'Enter an amount and pick participants.',
    cancelEdit: 'Cancel edit',
    saveChanges: 'Save changes',
    expenseReview: 'Expense review',
    totalWithAmount: (amount) => `${amount} total`,
    noExpenses: 'No expenses yet',
    noExpensesCopy: 'Each expense appears in a table so input mistakes are easier to catch.',
    expenseTableDescription: 'Description',
    expenseTableAmount: 'Amount',
    expenseTablePayer: 'Payer',
    expenseTableSharedBy: 'Shared by',
    expenseTableShare: 'Equal share',
    expenseTableActions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    summary: 'Summary',
    paidVsOwed: 'Paid vs owed',
    addParticipantsToSeeSummary: 'Add participants to see per-person totals.',
    summaryTableParticipant: 'Participant',
    summaryTablePaid: 'Paid',
    summaryTableOwed: 'Owed',
    summaryTableNet: 'Net',
    finalSettlement: 'Final settlement',
    suggestedTransfers: 'Suggested transfers',
    addExpensesToCalculate: 'Add expenses to calculate settlement.',
    alreadySettled: 'Everyone is already settled.',
    pays: 'pays',
    importExportShare: 'Import and share',
    browserOnlySharing: 'Browser-only sharing',
    importJson: 'Import JSON',
    generateShareLink: 'Generate share link',
    snapshotLink: 'Snapshot link',
    autosaveNotice: 'Current activity auto-saves in localStorage on this device.',
    snapshotNotice: 'Share links are snapshots, not live collaboration. Anyone opening the link gets a local copy in their browser.',
    loadedFromShareLink: 'Loaded activity from a share link. Any edits now save locally in this browser.',
    importedSuccess: (name) => `Imported "${name}" successfully.`,
    importedFailure: 'That file could not be imported. Please choose a valid Splits JSON export.',
    shareCopied: 'Snapshot link copied to clipboard.',
    shareManualCopy: 'Snapshot link generated below. Copy it manually if needed.',
    untitledActivity: 'Untitled activity',
    unknownParticipant: 'Unknown participant',
    unnamedParticipant: 'Unnamed participant',
    noParticipantsSelected: 'No participants selected.',
    each: 'each',
    splitRemainder: (baseCount, baseShare, remainderCount, higherShare) =>
      `${baseCount} pay ${baseShare}, ${remainderCount} pay ${higherShare}`,
  },
  zh: {
    languageLabel: '语言',
    languageEnglish: 'English',
    languageChinese: '中文',
    eyebrow: '面向单次活动的轻量分账工具',
    heroTitle: '好友分账',
    heroCopy: '谁付了多少，谁该转给谁，一算就清楚。',
    flowTitle: '使用流程',
    flowStepOneTitle: '1. 创建活动',
    flowStepOneCopy: '先填写活动名称，并把这次参与分账的人全部加进来。',
    flowStepTwoTitle: '2. 录入支出',
    flowStepTwoCopy: '逐笔填写支出说明、金额、付款人和分摊对象。',
    flowStepThreeTitle: '3. 核对与分享',
    flowStepThreeCopy: '核对表格结果，确认无误后生成分享链接发给朋友。',
    startOver: '重新开始',
    activitySetup: '活动设置',
    participantsCount: (count) => `${count} 位参与者`,
    expensesCount: (count) => `${count} 笔支出`,
    activityName: '活动名称',
    activityNamePlaceholder: '周末旅行、聚餐、生日派对……',
    activityNameRequired: '活动名称不能为空。',
    addAtLeastOneParticipant: '请至少添加一位参与者。',
    addParticipant: '添加参与者',
    participantNamePlaceholder: '姓名',
    add: '添加',
    participantNameRequired: '请输入参与者姓名。',
    participantUsedError: '该参与者已被支出使用，请先修改或删除相关支出后再移除。',
    noParticipants: '还没有参与者',
    noParticipantsCopy: '先把参与活动的人添加进来，再开始录入共同支出。',
    participantTableName: '参与者',
    participantTableStatus: '状态',
    participantTableActions: '操作',
    participantStatusReady: '已加入',
    addExpense: '添加支出',
    editExpense: '编辑支出',
    description: '支出说明',
    descriptionPlaceholder: '晚餐、打车、买菜……',
    descriptionRequired: '支出说明不能为空。',
    amount: '金额',
    amountPlaceholder: '0.00',
    positiveAmountRequired: '请输入有效的正数金额。',
    payer: '付款人',
    selectPayer: '选择付款人',
    validPayerRequired: '请选择有效的付款人。',
    shareQuestion: '这笔支出由哪些人分摊？',
    addParticipantsFirst: '请先添加参与者。',
    selectAtLeastOneParticipant: '请至少选择一位分摊者。',
    invalidParticipantsSelected: '所选分摊者中包含无效参与者。',
    equalSharePreview: '均摊预览：',
    enterAmountAndParticipants: '请输入金额并选择分摊参与者。',
    cancelEdit: '取消编辑',
    saveChanges: '保存修改',
    expenseReview: '支出核对',
    totalWithAmount: (amount) => `总计 ${amount}`,
    noExpenses: '还没有支出',
    noExpensesCopy: '每笔支出会以表格展示，方便核对录入是否有误。',
    expenseTableDescription: '支出说明',
    expenseTableAmount: '金额',
    expenseTablePayer: '付款人',
    expenseTableSharedBy: '分摊人',
    expenseTableShare: '均摊',
    expenseTableActions: '操作',
    edit: '编辑',
    delete: '删除',
    summary: '汇总',
    paidVsOwed: '已付 vs 应摊',
    addParticipantsToSeeSummary: '添加参与者后即可查看每个人的汇总。',
    summaryTableParticipant: '参与者',
    summaryTablePaid: '已付',
    summaryTableOwed: '应摊',
    summaryTableNet: '净额',
    finalSettlement: '最终结算',
    suggestedTransfers: '建议转账',
    addExpensesToCalculate: '添加支出后即可计算结算结果。',
    alreadySettled: '当前已经结清。',
    pays: '支付给',
    importExportShare: '导入与分享',
    browserOnlySharing: '仅浏览器内分享',
    importJson: '导入 JSON',
    generateShareLink: '生成分享链接',
    snapshotLink: '快照链接',
    autosaveNotice: '当前活动会自动保存在此设备浏览器的 localStorage 中。',
    snapshotNotice: '分享链接是当前状态的快照，不是实时协作。别人打开链接后，会在自己的浏览器里得到一份本地副本。',
    loadedFromShareLink: '已从分享链接加载活动。之后的修改会保存在当前浏览器中。',
    importedSuccess: (name) => `已成功导入“${name}”。`,
    importedFailure: '导入失败，请选择有效的 Splits JSON 文件。',
    shareCopied: '快照链接已复制到剪贴板。',
    shareManualCopy: '快照链接已生成，请手动复制下面的地址。',
    untitledActivity: '未命名活动',
    unknownParticipant: '未知参与者',
    unnamedParticipant: '未命名参与者',
    noParticipantsSelected: '未选择参与者。',
    each: '每人',
    splitRemainder: (baseCount, baseShare, remainderCount, higherShare) =>
      `${baseCount} 人分摊 ${baseShare}，${remainderCount} 人分摊 ${higherShare}`,
  },
}

export function getSavedLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return saved === 'en' ? 'en' : 'zh'
}

export function saveLanguage(language: Language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}
