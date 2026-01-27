"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { QuestionCreateRequestQuestionType } from "@/generated/api/openAPIDefinition.schemas";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";

interface QuestionTemplateFormProps {
  questionType: QuestionCreateRequestQuestionType;
  templateData: any;
  onChange: (templateData: any) => void;
}

// Helper component for ScoringConfig
function ScoringConfigForm({
  scoringConfig,
  onChange,
  defaultStrategy = "BINARY",
}: {
  scoringConfig: any;
  onChange: (config: any) => void;
  defaultStrategy?: string;
}) {
  const { t } = useTranslation();
  const config = scoringConfig || {
    strategy: defaultStrategy,
    allowPartialCredit: false,
    penaltyPerWrong: 0.0,
    roundScore: false,
    decimalPlaces: 2,
  };

  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="rbt-card rbt-card-body mt--20" style={{ backgroundColor: '#f0f0f0' }}>
      <h6 className="mb--15">{t("admin.exam.scoringConfig") || "Scoring Configuration"}</h6>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="scoringStrategy">
              {t("admin.exam.scoringStrategy") || "Strategy"}
            </Label>
            <select
              id="scoringStrategy"
              className="form-control"
              value={config.strategy || defaultStrategy}
              onChange={(e) => updateConfig("strategy", e.target.value)}
            >
              <option value="BINARY">BINARY</option>
              <option value="PROPORTIONAL">PROPORTIONAL</option>
              <option value="POSITION_BASED">POSITION_BASED</option>
              <option value="MANUAL">MANUAL</option>
              <option value="HYBRID">HYBRID</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="decimalPlaces">
              {t("admin.exam.decimalPlaces") || "Decimal Places"}
            </Label>
            <Input
              id="decimalPlaces"
              type="number"
              min="0"
              max="5"
              value={config.decimalPlaces || 2}
              onChange={(e) => updateConfig("decimalPlaces", parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group d-flex gap-3 align-items-center">
            <input
              type="checkbox"
              id="allowPartialCredit"
              checked={config.allowPartialCredit || false}
              onChange={(e) => updateConfig("allowPartialCredit", e.target.checked)}
            />
            <Label htmlFor="allowPartialCredit" className="cursor-pointer mb--0">
              {t("admin.exam.allowPartialCredit") || "Allow Partial Credit"}
            </Label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group d-flex gap-3 align-items-center">
            <input
              type="checkbox"
              id="roundScore"
              checked={config.roundScore || false}
              onChange={(e) => updateConfig("roundScore", e.target.checked)}
            />
            <Label htmlFor="roundScore" className="cursor-pointer mb--0">
              {t("admin.exam.roundScore") || "Round Score"}
            </Label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Label htmlFor="penaltyPerWrong">
              {t("admin.exam.penaltyPerWrong") || "Penalty Per Wrong (0.0-1.0)"}
            </Label>
            <Input
              id="penaltyPerWrong"
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={config.penaltyPerWrong || 0.0}
              onChange={(e) => updateConfig("penaltyPerWrong", parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionTemplateForm({
  questionType,
  templateData,
  onChange,
}: QuestionTemplateFormProps) {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState<any>(templateData || {});

  useEffect(() => {
    setLocalData(templateData || {});
  }, [templateData]);

  const updateData = (newData: any) => {
    setLocalData(newData);
    onChange(newData);
  };

  // Multiple Choice Template
  if (questionType === QuestionCreateRequestQuestionType.MULTIPLE_CHOICE) {
    const choices = localData.options?.choices || [];

    const addChoice = () => {
      const newChoice = {
        id: `choice_${Date.now()}`,
        text: "",
        isCorrect: false,
        feedback: "",
        scorePercentage: 1.0,
      };
      updateData({
        ...localData,
        options: {
          ...localData.options,
          choices: [...choices, newChoice],
        },
        shuffleChoices: localData.shuffleChoices ?? true,
        showFeedback: localData.showFeedback ?? false,
        scoringConfig: localData.scoringConfig || {
          strategy: "BINARY",
          allowPartialCredit: false,
          penaltyPerWrong: 0.0,
          roundScore: false,
          decimalPlaces: 2,
        },
      });
    };

    const updateChoice = (index: number, field: string, value: any) => {
      const updatedChoices = [...choices];
      updatedChoices[index] = { ...updatedChoices[index], [field]: value };
      updateData({
        ...localData,
        options: {
          ...localData.options,
          choices: updatedChoices,
        },
      });
    };

    const removeChoice = (index: number) => {
      const updatedChoices = choices.filter((_: any, i: number) => i !== index);
      updateData({
        ...localData,
        options: {
          ...localData.options,
          choices: updatedChoices,
        },
      });
    };

    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="d-flex justify-content-between align-items-center mb--20">
          <label className="mb--0">{t("admin.exam.choices")}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addChoice}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addChoice")}
          </button>
        </div>

        {choices.length === 0 ? (
          <p className="text-muted text-center py--20">
            {t("admin.exam.noChoices")}
          </p>
        ) : (
          <div className="row g-3">
            {choices.map((choice: any, index: number) => (
              <div key={choice.id || index} className="col-12">
                <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="form-group">
                        <Label htmlFor={`choice-text-${index}`}>
                          {t("admin.exam.choiceText")} {index + 1}
                        </Label>
                        <Input
                          id={`choice-text-${index}`}
                          value={choice.text || ""}
                          onChange={(e) => updateChoice(index, "text", e.target.value)}
                          placeholder={t("admin.exam.choiceText")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`choice-feedback-${index}`}>
                          {t("admin.exam.feedback") || "Feedback"}
                        </Label>
                        <Input
                          id={`choice-feedback-${index}`}
                          value={choice.feedback || ""}
                          onChange={(e) => updateChoice(index, "feedback", e.target.value)}
                          placeholder={t("admin.exam.feedback") || "Feedback"}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`choice-score-${index}`}>
                          {t("admin.exam.scorePercentage") || "Score % (0.0-1.0)"}
                        </Label>
                        <Input
                          id={`choice-score-${index}`}
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={choice.scorePercentage || 1.0}
                          onChange={(e) => updateChoice(index, "scorePercentage", parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group d-flex gap-3 align-items-center">
                        <input
                          type="checkbox"
                          id={`correct-${index}`}
                          checked={choice.isCorrect || false}
                          onChange={(e) =>
                            updateChoice(index, "isCorrect", e.target.checked)
                          }
                        />
                        <Label htmlFor={`correct-${index}`} className="cursor-pointer mb--0">
                          {t("admin.exam.isCorrect")}
                        </Label>
                        <button
                          type="button"
                          className="rbt-btn btn-sm btn-border ms-auto"
                          onClick={() => removeChoice(index)}
                        >
                          <i className="feather-trash-2 me-1"></i>
                          {t("common.delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="row g-3 mt--20">
          <div className="col-md-6">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="shuffleChoices"
                checked={localData.shuffleChoices ?? true}
                onChange={(e) =>
                  updateData({ ...localData, shuffleChoices: e.target.checked })
                }
              />
              <Label htmlFor="shuffleChoices" className="cursor-pointer mb--0">
                {t("admin.exam.shuffleChoices")}
              </Label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="showFeedback"
                checked={localData.showFeedback ?? false}
                onChange={(e) =>
                  updateData({ ...localData, showFeedback: e.target.checked })
                }
              />
              <Label htmlFor="showFeedback" className="cursor-pointer mb--0">
                {t("admin.exam.showFeedback") || "Show Feedback"}
              </Label>
            </div>
          </div>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="BINARY"
        />
      </div>
    );
  }

  // True/False Template
  if (questionType === QuestionCreateRequestQuestionType.TRUE_FALSE) {
    const options = localData.options || {};
    
    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="form-group">
          <Label htmlFor="correctAnswer">{t("admin.exam.correctAnswer")}</Label>
          <select
            id="correctAnswer"
            className="form-control"
            value={options.correctAnswer === false ? "false" : "true"}
            onChange={(e) =>
              updateData({
                ...localData,
                options: { ...options, correctAnswer: e.target.value === "true" },
                showFeedback: localData.showFeedback ?? false,
                scoringConfig: localData.scoringConfig || {
                  strategy: "BINARY",
                  allowPartialCredit: false,
                  penaltyPerWrong: 0.0,
                  roundScore: false,
                  decimalPlaces: 2,
                },
              })
            }
          >
            <option value="true">{t("admin.exam.true")}</option>
            <option value="false">{t("admin.exam.false")}</option>
          </select>
        </div>

        <div className="form-group d-flex gap-3 mt--20 align-items-center">
          <input
            type="checkbox"
            id="showFeedback"
            checked={localData.showFeedback ?? false}
            onChange={(e) =>
              updateData({ ...localData, showFeedback: e.target.checked })
            }
          />
          <Label htmlFor="showFeedback" className="cursor-pointer mb--0">
            {t("admin.exam.showFeedback") || "Show Feedback"}
          </Label>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="BINARY"
        />
      </div>
    );
  }

  // Short Answer Template
  if (questionType === QuestionCreateRequestQuestionType.SHORT_ANSWER) {
    const options = localData.options || {};
    const answers = options.acceptableAnswers || [];

    const addAnswer = () => {
      const newAnswer = {
        answer: "",
        scorePercentage: 1.0,
        caseSensitive: false,
        exactMatch: false,
      };
      updateData({
        ...localData,
        options: {
          ...options,
          acceptableAnswers: [...answers, newAnswer],
        },
        maxCharacters: localData.maxCharacters ?? 500,
        minCharacters: localData.minCharacters ?? 10,
        trimWhitespace: localData.trimWhitespace ?? true,
        scoringConfig: localData.scoringConfig || {
          strategy: "PROPORTIONAL",
          allowPartialCredit: true,
          penaltyPerWrong: 0.0,
          roundScore: false,
          decimalPlaces: 2,
        },
      });
    };

    const updateAnswer = (index: number, field: string, value: any) => {
      const updated = [...answers];
      updated[index] = { ...updated[index], [field]: value };
      updateData({
        ...localData,
        options: {
          ...options,
          acceptableAnswers: updated,
        },
      });
    };

    const removeAnswer = (index: number) => {
      const updated = answers.filter((_: any, i: number) => i !== index);
      updateData({
        ...localData,
        options: {
          ...options,
          acceptableAnswers: updated,
        },
      });
    };

    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="row g-3 mb--20">
          <div className="col-md-6">
            <div className="form-group">
              <Label htmlFor="placeholder">
                {t("admin.exam.placeholder") || "Placeholder"}
              </Label>
              <Input
                id="placeholder"
                value={options.placeholder || ""}
                onChange={(e) =>
                  updateData({
                    ...localData,
                    options: { ...options, placeholder: e.target.value },
                  })
                }
                placeholder={t("admin.exam.placeholder") || "Placeholder text"}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <Label htmlFor="minCharacters">
                {t("admin.exam.minCharacters") || "Min Characters"}
              </Label>
              <Input
                id="minCharacters"
                type="number"
                min="1"
                value={localData.minCharacters ?? 10}
                onChange={(e) =>
                  updateData({
                    ...localData,
                    minCharacters: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <Label htmlFor="maxCharacters">
                {t("admin.exam.maxCharacters") || "Max Characters"}
              </Label>
              <Input
                id="maxCharacters"
                type="number"
                min="1"
                value={localData.maxCharacters ?? 500}
                onChange={(e) =>
                  updateData({
                    ...localData,
                    maxCharacters: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb--20">
          <label className="mb--0">{t("admin.exam.acceptableAnswers")}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addAnswer}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addAnswer")}
          </button>
        </div>

        {answers.length === 0 ? (
          <p className="text-muted text-center py--20">
            {t("admin.exam.noAnswers")}
          </p>
        ) : (
          <div className="row g-3">
            {answers.map((answer: any, index: number) => (
              <div key={index} className="col-12">
                <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="form-group">
                        <Label htmlFor={`answer-${index}`}>
                          {t("admin.exam.answerText")} {index + 1}
                        </Label>
                        <Input
                          id={`answer-${index}`}
                          value={answer.answer || ""}
                          onChange={(e) => updateAnswer(index, "answer", e.target.value)}
                          placeholder={t("admin.exam.answerText")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <Label htmlFor={`answer-score-${index}`}>
                          {t("admin.exam.scorePercentage") || "Score %"}
                        </Label>
                        <Input
                          id={`answer-score-${index}`}
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={answer.scorePercentage || 1.0}
                          onChange={(e) =>
                            updateAnswer(index, "scorePercentage", parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group d-flex gap-3 align-items-center">
                        <input
                          type="checkbox"
                          id={`case-sensitive-${index}`}
                          checked={answer.caseSensitive || false}
                          onChange={(e) =>
                            updateAnswer(index, "caseSensitive", e.target.checked)
                          }
                        />
                        <Label htmlFor={`case-sensitive-${index}`} className="cursor-pointer mb--0">
                          {t("admin.exam.caseSensitive") || "Case Sensitive"}
                        </Label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group d-flex gap-3 align-items-center">
                        <input
                          type="checkbox"
                          id={`exact-match-${index}`}
                          checked={answer.exactMatch || false}
                          onChange={(e) =>
                            updateAnswer(index, "exactMatch", e.target.checked)
                          }
                        />
                        <Label htmlFor={`exact-match-${index}`} className="cursor-pointer mb--0">
                          {t("admin.exam.exactMatch") || "Exact Match"}
                        </Label>
                        <button
                          type="button"
                          className="rbt-btn btn-sm btn-border ms-auto"
                          onClick={() => removeAnswer(index)}
                        >
                          <i className="feather-trash-2 me-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="form-group d-flex gap-3 mt--20 align-items-center">
          <input
            type="checkbox"
            id="trimWhitespace"
            checked={localData.trimWhitespace ?? true}
            onChange={(e) =>
              updateData({ ...localData, trimWhitespace: e.target.checked })
            }
          />
          <Label htmlFor="trimWhitespace" className="cursor-pointer mb--0">
            {t("admin.exam.trimWhitespace") || "Trim Whitespace"}
          </Label>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="PROPORTIONAL"
        />
      </div>
    );
  }

  // Fill in the Blanks Template
  if (questionType === QuestionCreateRequestQuestionType.FILL_IN_THE_BLANKS) {
    const options = localData.options || {};
    const blanks = options.blanks || [];

    const addBlank = () => {
      const blankId = `BLANK_${blanks.length + 1}`;
      const newBlank = {
        blankId,
        acceptableAnswers: [
          {
            answer: "",
            scorePercentage: 1.0,
            caseSensitive: false,
            exactMatch: false,
          },
        ],
      };
      updateData({
        ...localData,
        textWithBlanks: localData.textWithBlanks || "",
        options: {
          ...options,
          blanks: [...blanks, newBlank],
        },
        trimWhitespace: localData.trimWhitespace ?? true,
        scoringConfig: localData.scoringConfig || {
          strategy: "PROPORTIONAL",
          allowPartialCredit: true,
          penaltyPerWrong: 0.0,
          roundScore: false,
          decimalPlaces: 2,
        },
      });
    };

    const updateBlank = (index: number, field: string, value: any) => {
      const updated = [...blanks];
      updated[index] = { ...updated[index], [field]: value };
      updateData({
        ...localData,
        options: {
          ...options,
          blanks: updated,
        },
      });
    };

    const addAcceptableAnswer = (blankIndex: number) => {
      const updated = [...blanks];
      if (!updated[blankIndex].acceptableAnswers) {
        updated[blankIndex].acceptableAnswers = [];
      }
      updated[blankIndex].acceptableAnswers.push({
        answer: "",
        scorePercentage: 1.0,
        caseSensitive: false,
        exactMatch: false,
      });
      updateData({
        ...localData,
        options: {
          ...options,
          blanks: updated,
        },
      });
    };

    const updateAcceptableAnswer = (
      blankIndex: number,
      answerIndex: number,
      field: string,
      value: any
    ) => {
      const updated = [...blanks];
      updated[blankIndex].acceptableAnswers[answerIndex] = {
        ...updated[blankIndex].acceptableAnswers[answerIndex],
        [field]: value,
      };
      updateData({
        ...localData,
        options: {
          ...options,
          blanks: updated,
        },
      });
    };

    const removeAcceptableAnswer = (blankIndex: number, answerIndex: number) => {
      const updated = [...blanks];
      updated[blankIndex].acceptableAnswers = updated[blankIndex].acceptableAnswers.filter(
        (_: any, i: number) => i !== answerIndex
      );
      updateData({
        ...localData,
        options: {
          ...options,
          blanks: updated,
        },
      });
    };

    const removeBlank = (index: number) => {
      const updated = blanks.filter((_: any, i: number) => i !== index);
      updateData({
        ...localData,
        options: {
          ...options,
          blanks: updated,
        },
      });
    };

    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="form-group mb--20">
          <Label htmlFor="textWithBlanks">
            {t("admin.exam.textWithBlanks") || "Text with Blanks"}
            <small className="text-muted d-block">
              Use {"{{BLANK_1}}"}, {"{{BLANK_2}}"}, etc. for blanks
            </small>
          </Label>
          <Textarea
            id="textWithBlanks"
            value={localData.textWithBlanks || ""}
            onChange={(e) =>
              updateData({ ...localData, textWithBlanks: e.target.value })
            }
            placeholder="The capital of Turkey is {{BLANK_1}}"
            rows={4}
            className="form-control"
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb--20">
          <label className="mb--0">{t("admin.exam.blanks")}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addBlank}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addBlank")}
          </button>
        </div>

        {blanks.length === 0 ? (
          <p className="text-muted text-center py--20">
            {t("admin.exam.noBlanks")}
          </p>
        ) : (
          <div className="row g-3">
            {blanks.map((blank: any, blankIndex: number) => (
              <div key={blank.blankId || blankIndex} className="col-12">
                <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                  <div className="d-flex justify-content-between align-items-center mb--15">
                    <label className="mb--0">
                      {t("admin.exam.blank")} {blank.blankId || blankIndex + 1}
                    </label>
                    <button
                      type="button"
                      className="rbt-btn btn-sm btn-border"
                      onClick={() => removeBlank(blankIndex)}
                    >
                      <i className="feather-trash-2 me-1"></i>
                      {t("common.delete")}
                    </button>
                  </div>

                  <div className="form-group mb--15">
                    <Label htmlFor={`blank-id-${blankIndex}`}>
                      {t("admin.exam.blankId") || "Blank ID"}
                    </Label>
                    <Input
                      id={`blank-id-${blankIndex}`}
                      value={blank.blankId || ""}
                      onChange={(e) => updateBlank(blankIndex, "blankId", e.target.value)}
                      placeholder="BLANK_1"
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb--15">
                    <label className="mb--0">
                      {t("admin.exam.acceptableAnswers")}
                    </label>
                    <button
                      type="button"
                      className="rbt-btn btn-sm btn-border-gradient"
                      onClick={() => addAcceptableAnswer(blankIndex)}
                    >
                      <i className="feather-plus me-1"></i>
                      {t("admin.exam.addAnswer")}
                    </button>
                  </div>

                  {blank.acceptableAnswers?.map((answer: any, answerIndex: number) => (
                    <div key={answerIndex} className="row g-2 mb--10">
                      <div className="col-md-5">
                        <Input
                          value={answer.answer || ""}
                          onChange={(e) =>
                            updateAcceptableAnswer(blankIndex, answerIndex, "answer", e.target.value)
                          }
                          placeholder={t("admin.exam.answerText")}
                        />
                      </div>
                      <div className="col-md-3">
                        <Input
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={answer.scorePercentage || 1.0}
                          onChange={(e) =>
                            updateAcceptableAnswer(
                              blankIndex,
                              answerIndex,
                              "scorePercentage",
                              parseFloat(e.target.value)
                            )
                          }
                          placeholder="Score %"
                        />
                      </div>
                      <div className="col-md-2">
                        <div className="d-flex gap-2 align-items-center">
                          <input
                            type="checkbox"
                            checked={answer.caseSensitive || false}
                            onChange={(e) =>
                              updateAcceptableAnswer(
                                blankIndex,
                                answerIndex,
                                "caseSensitive",
                                e.target.checked
                              )
                            }
                          />
                          <Label className="mb--0 small">Case</Label>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="d-flex gap-2 align-items-center">
                          <input
                            type="checkbox"
                            checked={answer.exactMatch || false}
                            onChange={(e) =>
                              updateAcceptableAnswer(
                                blankIndex,
                                answerIndex,
                                "exactMatch",
                                e.target.checked
                              )
                            }
                          />
                          <Label className="mb--0 small">Exact</Label>
                          <button
                            type="button"
                            className="rbt-btn btn-sm btn-border ms-auto"
                            onClick={() => removeAcceptableAnswer(blankIndex, answerIndex)}
                          >
                            <i className="feather-x"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="form-group d-flex gap-3 mt--20 align-items-center">
          <input
            type="checkbox"
            id="trimWhitespace"
            checked={localData.trimWhitespace ?? true}
            onChange={(e) =>
              updateData({ ...localData, trimWhitespace: e.target.checked })
            }
          />
          <Label htmlFor="trimWhitespace" className="cursor-pointer mb--0">
            {t("admin.exam.trimWhitespace") || "Trim Whitespace"}
          </Label>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="PROPORTIONAL"
        />
      </div>
    );
  }

  // Multiple Response Template
  if (questionType === QuestionCreateRequestQuestionType.MULTIPLE_RESPONSE) {
    const choices = localData.options?.choices || [];

    const addChoice = () => {
      const newChoice = {
        id: `choice_${Date.now()}`,
        text: "",
        isCorrect: false,
        feedback: "",
        scorePercentage: 1.0,
      };
      updateData({
        ...localData,
        options: {
          ...localData.options,
          choices: [...choices, newChoice],
        },
        minSelections: localData.minSelections ?? 1,
        maxSelections: localData.maxSelections ?? 999,
        shuffleChoices: localData.shuffleChoices ?? true,
        showFeedback: localData.showFeedback ?? false,
        scoringConfig: localData.scoringConfig || {
          strategy: "PROPORTIONAL",
          allowPartialCredit: true,
          penaltyPerWrong: 0.25,
          roundScore: false,
          decimalPlaces: 2,
        },
      });
    };

    const updateChoice = (index: number, field: string, value: any) => {
      const updatedChoices = [...choices];
      updatedChoices[index] = { ...updatedChoices[index], [field]: value };
      updateData({
        ...localData,
        options: {
          ...localData.options,
          choices: updatedChoices,
        },
      });
    };

    const removeChoice = (index: number) => {
      const updatedChoices = choices.filter((_: any, i: number) => i !== index);
      updateData({
        ...localData,
        options: {
          ...localData.options,
          choices: updatedChoices,
        },
      });
    };

    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="row g-3 mb--20">
          <div className="col-md-6">
            <div className="form-group">
              <Label htmlFor="minSelections">
                {t("admin.exam.minSelections") || "Min Selections"}
              </Label>
              <Input
                id="minSelections"
                type="number"
                min="1"
                value={localData.minSelections ?? 1}
                onChange={(e) =>
                  updateData({ ...localData, minSelections: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <Label htmlFor="maxSelections">
                {t("admin.exam.maxSelections") || "Max Selections"}
              </Label>
              <Input
                id="maxSelections"
                type="number"
                min="1"
                value={localData.maxSelections ?? 999}
                onChange={(e) =>
                  updateData({ ...localData, maxSelections: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb--20">
          <label className="mb--0">{t("admin.exam.choices")}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addChoice}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addChoice")}
          </button>
        </div>

        {choices.length === 0 ? (
          <p className="text-muted text-center py--20">
            {t("admin.exam.noChoices")}
          </p>
        ) : (
          <div className="row g-3">
            {choices.map((choice: any, index: number) => (
              <div key={choice.id || index} className="col-12">
                <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="form-group">
                        <Label htmlFor={`choice-text-${index}`}>
                          {t("admin.exam.choiceText")} {index + 1}
                        </Label>
                        <Input
                          id={`choice-text-${index}`}
                          value={choice.text || ""}
                          onChange={(e) => updateChoice(index, "text", e.target.value)}
                          placeholder={t("admin.exam.choiceText")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`choice-feedback-${index}`}>
                          {t("admin.exam.feedback") || "Feedback"}
                        </Label>
                        <Input
                          id={`choice-feedback-${index}`}
                          value={choice.feedback || ""}
                          onChange={(e) => updateChoice(index, "feedback", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`choice-score-${index}`}>
                          {t("admin.exam.scorePercentage") || "Score %"}
                        </Label>
                        <Input
                          id={`choice-score-${index}`}
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={choice.scorePercentage || 1.0}
                          onChange={(e) =>
                            updateChoice(index, "scorePercentage", parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group d-flex gap-3 align-items-center">
                        <input
                          type="checkbox"
                          id={`correct-${index}`}
                          checked={choice.isCorrect || false}
                          onChange={(e) =>
                            updateChoice(index, "isCorrect", e.target.checked)
                          }
                        />
                        <Label htmlFor={`correct-${index}`} className="cursor-pointer mb--0">
                          {t("admin.exam.isCorrect")}
                        </Label>
                        <button
                          type="button"
                          className="rbt-btn btn-sm btn-border ms-auto"
                          onClick={() => removeChoice(index)}
                        >
                          <i className="feather-trash-2 me-1"></i>
                          {t("common.delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="row g-3 mt--20">
          <div className="col-md-6">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="shuffleChoices"
                checked={localData.shuffleChoices ?? true}
                onChange={(e) =>
                  updateData({ ...localData, shuffleChoices: e.target.checked })
                }
              />
              <Label htmlFor="shuffleChoices" className="cursor-pointer mb--0">
                {t("admin.exam.shuffleChoices")}
              </Label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="showFeedback"
                checked={localData.showFeedback ?? false}
                onChange={(e) =>
                  updateData({ ...localData, showFeedback: e.target.checked })
                }
              />
              <Label htmlFor="showFeedback" className="cursor-pointer mb--0">
                {t("admin.exam.showFeedback") || "Show Feedback"}
              </Label>
            </div>
          </div>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="PROPORTIONAL"
        />
      </div>
    );
  }

  // Matching Template
  if (questionType === QuestionCreateRequestQuestionType.MATCHING) {
    const options = localData.options || {};
    const pairs = options.pairs || [];
    const distractors = options.distractors || [];

    const addPair = () => {
      const newPair = {
        leftId: `left_${Date.now()}`,
        leftText: "",
        leftMediaUrl: "",
        rightId: `right_${Date.now()}`,
        rightText: "",
        rightMediaUrl: "",
        feedback: "",
        scorePercentage: 1.0,
      };
      updateData({
        ...localData,
        options: {
          ...options,
          pairs: [...pairs, newPair],
          matchingType: options.matchingType || "ONE_TO_ONE",
        },
        shuffleLeftItems: localData.shuffleLeftItems ?? true,
        shuffleRightItems: localData.shuffleRightItems ?? true,
        showFeedback: localData.showFeedback ?? false,
        scoringConfig: localData.scoringConfig || {
          strategy: "PROPORTIONAL",
          allowPartialCredit: true,
          penaltyPerWrong: 0.0,
          roundScore: false,
          decimalPlaces: 2,
        },
      });
    };

    const updatePair = (index: number, field: string, value: any) => {
      const updated = [...pairs];
      updated[index] = { ...updated[index], [field]: value };
      updateData({
        ...localData,
        options: {
          ...options,
          pairs: updated,
        },
      });
    };

    const removePair = (index: number) => {
      const updated = pairs.filter((_: any, i: number) => i !== index);
      updateData({
        ...localData,
        options: {
          ...options,
          pairs: updated,
        },
      });
    };

    const addDistractor = () => {
      const newDistractor = {
        id: `distractor_${Date.now()}`,
        text: "",
        mediaUrl: "",
        side: "LEFT",
      };
      updateData({
        ...localData,
        options: {
          ...options,
          distractors: [...distractors, newDistractor],
        },
      });
    };

    const updateDistractor = (index: number, field: string, value: any) => {
      const updated = [...distractors];
      updated[index] = { ...updated[index], [field]: value };
      updateData({
        ...localData,
        options: {
          ...options,
          distractors: updated,
        },
      });
    };

    const removeDistractor = (index: number) => {
      const updated = distractors.filter((_: any, i: number) => i !== index);
      updateData({
        ...localData,
        options: {
          ...options,
          distractors: updated,
        },
      });
    };

    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="form-group mb--20">
          <Label htmlFor="matchingType">
            {t("admin.exam.matchingType") || "Matching Type"}
          </Label>
          <select
            id="matchingType"
            className="form-control"
            value={options.matchingType || "ONE_TO_ONE"}
            onChange={(e) =>
              updateData({
                ...localData,
                options: { ...options, matchingType: e.target.value },
              })
            }
          >
            <option value="ONE_TO_ONE">ONE_TO_ONE</option>
            <option value="MANY_TO_ONE">MANY_TO_ONE</option>
          </select>
        </div>

        <div className="d-flex justify-content-between align-items-center mb--20">
          <label className="mb--0">{t("admin.exam.matchingPairs") || "Matching Pairs"}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addPair}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addPair") || "Add Pair"}
          </button>
        </div>

        {pairs.length === 0 ? (
          <p className="text-muted text-center py--20">
            {t("admin.exam.noPairs") || "No pairs added"}
          </p>
        ) : (
          <div className="row g-3">
            {pairs.map((pair: any, index: number) => (
              <div key={index} className="col-12">
                <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                  <div className="d-flex justify-content-between align-items-center mb--15">
                    <label className="mb--0">
                      {t("admin.exam.pair") || "Pair"} {index + 1}
                    </label>
                    <button
                      type="button"
                      className="rbt-btn btn-sm btn-border"
                      onClick={() => removePair(index)}
                    >
                      <i className="feather-trash-2 me-1"></i>
                      {t("common.delete")}
                    </button>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`left-text-${index}`}>
                          {t("admin.exam.leftText") || "Left Text"}
                        </Label>
                        <Input
                          id={`left-text-${index}`}
                          value={pair.leftText || ""}
                          onChange={(e) => updatePair(index, "leftText", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`right-text-${index}`}>
                          {t("admin.exam.rightText") || "Right Text"}
                        </Label>
                        <Input
                          id={`right-text-${index}`}
                          value={pair.rightText || ""}
                          onChange={(e) => updatePair(index, "rightText", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`left-media-${index}`}>
                          {t("admin.exam.leftMediaUrl") || "Left Media URL"}
                        </Label>
                        <Input
                          id={`left-media-${index}`}
                          value={pair.leftMediaUrl || ""}
                          onChange={(e) => updatePair(index, "leftMediaUrl", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`right-media-${index}`}>
                          {t("admin.exam.rightMediaUrl") || "Right Media URL"}
                        </Label>
                        <Input
                          id={`right-media-${index}`}
                          value={pair.rightMediaUrl || ""}
                          onChange={(e) => updatePair(index, "rightMediaUrl", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`pair-feedback-${index}`}>
                          {t("admin.exam.feedback") || "Feedback"}
                        </Label>
                        <Input
                          id={`pair-feedback-${index}`}
                          value={pair.feedback || ""}
                          onChange={(e) => updatePair(index, "feedback", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`pair-score-${index}`}>
                          {t("admin.exam.scorePercentage") || "Score %"}
                        </Label>
                        <Input
                          id={`pair-score-${index}`}
                          type="number"
                          min="0"
                          max="1"
                          step="0.01"
                          value={pair.scorePercentage || 1.0}
                          onChange={(e) =>
                            updatePair(index, "scorePercentage", parseFloat(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt--20 mb--20">
          <label className="mb--0">{t("admin.exam.distractors") || "Distractors"}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addDistractor}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addDistractor") || "Add Distractor"}
          </button>
        </div>

        {distractors.length > 0 && (
          <div className="row g-3">
            {distractors.map((distractor: any, index: number) => (
              <div key={index} className="col-12">
                <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="form-group">
                        <Label htmlFor={`distractor-text-${index}`}>
                          {t("admin.exam.text") || "Text"}
                        </Label>
                        <Input
                          id={`distractor-text-${index}`}
                          value={distractor.text || ""}
                          onChange={(e) => updateDistractor(index, "text", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <Label htmlFor={`distractor-side-${index}`}>
                          {t("admin.exam.side") || "Side"}
                        </Label>
                        <select
                          id={`distractor-side-${index}`}
                          className="form-control"
                          value={distractor.side || "LEFT"}
                          onChange={(e) => updateDistractor(index, "side", e.target.value)}
                        >
                          <option value="LEFT">LEFT</option>
                          <option value="RIGHT">RIGHT</option>
                          <option value="BOTH">BOTH</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <Label htmlFor={`distractor-media-${index}`}>
                          {t("admin.exam.mediaUrl") || "Media URL"}
                        </Label>
                        <div className="d-flex gap-2">
                          <Input
                            id={`distractor-media-${index}`}
                            value={distractor.mediaUrl || ""}
                            onChange={(e) => updateDistractor(index, "mediaUrl", e.target.value)}
                          />
                          <button
                            type="button"
                            className="rbt-btn btn-sm btn-border"
                            onClick={() => removeDistractor(index)}
                          >
                            <i className="feather-trash-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="row g-3 mt--20">
          <div className="col-md-4">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="shuffleLeftItems"
                checked={localData.shuffleLeftItems ?? true}
                onChange={(e) =>
                  updateData({ ...localData, shuffleLeftItems: e.target.checked })
                }
              />
              <Label htmlFor="shuffleLeftItems" className="cursor-pointer mb--0">
                {t("admin.exam.shuffleLeftItems") || "Shuffle Left Items"}
              </Label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="shuffleRightItems"
                checked={localData.shuffleRightItems ?? true}
                onChange={(e) =>
                  updateData({ ...localData, shuffleRightItems: e.target.checked })
                }
              />
              <Label htmlFor="shuffleRightItems" className="cursor-pointer mb--0">
                {t("admin.exam.shuffleRightItems") || "Shuffle Right Items"}
              </Label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="showFeedback"
                checked={localData.showFeedback ?? false}
                onChange={(e) =>
                  updateData({ ...localData, showFeedback: e.target.checked })
                }
              />
              <Label htmlFor="showFeedback" className="cursor-pointer mb--0">
                {t("admin.exam.showFeedback") || "Show Feedback"}
              </Label>
            </div>
          </div>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="PROPORTIONAL"
        />
      </div>
    );
  }

  // Essay Template
  if (questionType === QuestionCreateRequestQuestionType.ESSAY) {
    const rubric = localData.rubric || [];
    const requiredTopics = localData.requiredTopics || [];

    const addRubricItem = () => {
      const newItem = {
        name: "",
        description: "",
        maxScore: 0,
        rubricLevel: "",
      };
      updateData({
        ...localData,
        prompt: localData.prompt || "",
        minWords: localData.minWords ?? 100,
        maxWords: localData.maxWords ?? 1000,
        requiredTopics,
        gradingType: localData.gradingType || "MANUAL",
        rubric: [...rubric, newItem],
        requireOutline: localData.requireOutline ?? false,
        allowedFormats: localData.allowedFormats || ["HTML", "MARKDOWN", "PLAIN_TEXT"],
        scoringConfig: localData.scoringConfig || {
          strategy: "MANUAL",
          allowPartialCredit: false,
          penaltyPerWrong: 0.0,
          roundScore: false,
          decimalPlaces: 2,
        },
      });
    };

    const updateRubricItem = (index: number, field: string, value: any) => {
      const updated = [...rubric];
      updated[index] = { ...updated[index], [field]: value };
      updateData({ ...localData, rubric: updated });
    };

    const removeRubricItem = (index: number) => {
      const updated = rubric.filter((_: any, i: number) => i !== index);
      updateData({ ...localData, rubric: updated });
    };

    const addRequiredTopic = () => {
      updateData({
        ...localData,
        requiredTopics: [...requiredTopics, ""],
      });
    };

    const updateRequiredTopic = (index: number, value: string) => {
      const updated = [...requiredTopics];
      updated[index] = value;
      updateData({ ...localData, requiredTopics: updated });
    };

    const removeRequiredTopic = (index: number) => {
      const updated = requiredTopics.filter((_: any, i: number) => i !== index);
      updateData({ ...localData, requiredTopics: updated });
    };

    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="form-group mb--20">
          <Label htmlFor="prompt">{t("admin.exam.prompt") || "Prompt"}</Label>
          <Textarea
            id="prompt"
            value={localData.prompt || ""}
            onChange={(e) => updateData({ ...localData, prompt: e.target.value })}
            rows={4}
            className="form-control"
          />
        </div>

        <div className="row g-3 mb--20">
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor="minWords">
                {t("admin.exam.minWords") || "Min Words"}
              </Label>
              <Input
                id="minWords"
                type="number"
                min="1"
                value={localData.minWords ?? 100}
                onChange={(e) =>
                  updateData({ ...localData, minWords: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor="maxWords">
                {t("admin.exam.maxWords") || "Max Words"}
              </Label>
              <Input
                id="maxWords"
                type="number"
                min="1"
                value={localData.maxWords ?? 1000}
                onChange={(e) =>
                  updateData({ ...localData, maxWords: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <Label htmlFor="gradingType">
                {t("admin.exam.gradingType") || "Grading Type"}
              </Label>
              <select
                id="gradingType"
                className="form-control"
                value={localData.gradingType || "MANUAL"}
                onChange={(e) =>
                  updateData({ ...localData, gradingType: e.target.value })
                }
              >
                <option value="MANUAL">MANUAL</option>
                <option value="AI">AI</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb--20">
          <label className="mb--0">{t("admin.exam.requiredTopics") || "Required Topics"}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addRequiredTopic}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addTopic") || "Add Topic"}
          </button>
        </div>

        {requiredTopics.map((topic: string, index: number) => (
          <div key={index} className="d-flex gap-2 mb--10">
            <Input
              value={topic}
              onChange={(e) => updateRequiredTopic(index, e.target.value)}
              placeholder={t("admin.exam.topic") || "Topic"}
            />
            <button
              type="button"
              className="rbt-btn btn-sm btn-border"
              onClick={() => removeRequiredTopic(index)}
            >
              <i className="feather-x"></i>
            </button>
          </div>
        ))}

        <div className="d-flex justify-content-between align-items-center mt--20 mb--20">
          <label className="mb--0">{t("admin.exam.rubric") || "Rubric"}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addRubricItem}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addRubricItem") || "Add Rubric Item"}
          </button>
        </div>

        {rubric.map((item: any, index: number) => (
          <div key={index} className="rbt-card rbt-card-body mb--10" style={{ backgroundColor: '#ffffff' }}>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="form-group">
                  <Label htmlFor={`rubric-name-${index}`}>
                    {t("admin.exam.name") || "Name"}
                  </Label>
                  <Input
                    id={`rubric-name-${index}`}
                    value={item.name || ""}
                    onChange={(e) => updateRubricItem(index, "name", e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <Label htmlFor={`rubric-maxScore-${index}`}>
                    {t("admin.exam.maxScore") || "Max Score"}
                  </Label>
                  <Input
                    id={`rubric-maxScore-${index}`}
                    type="number"
                    min="0"
                    value={item.maxScore || 0}
                    onChange={(e) =>
                      updateRubricItem(index, "maxScore", parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <Label htmlFor={`rubric-level-${index}`}>
                    {t("admin.exam.rubricLevel") || "Level"}
                  </Label>
                  <select
                    id={`rubric-level-${index}`}
                    className="form-control"
                    value={item.rubricLevel || ""}
                    onChange={(e) => updateRubricItem(index, "rubricLevel", e.target.value)}
                  >
                    <option value="">None</option>
                    <option value="BASIC">BASIC</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <Label htmlFor={`rubric-desc-${index}`}>
                    {t("admin.exam.description") || "Description"}
                  </Label>
                  <Textarea
                    id={`rubric-desc-${index}`}
                    value={item.description || ""}
                    onChange={(e) => updateRubricItem(index, "description", e.target.value)}
                    rows={2}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-12">
                <button
                  type="button"
                  className="rbt-btn btn-sm btn-border"
                  onClick={() => removeRubricItem(index)}
                >
                  <i className="feather-trash-2 me-1"></i>
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="row g-3 mt--20">
          <div className="col-md-6">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="requireOutline"
                checked={localData.requireOutline ?? false}
                onChange={(e) =>
                  updateData({ ...localData, requireOutline: e.target.checked })
                }
              />
              <Label htmlFor="requireOutline" className="cursor-pointer mb--0">
                {t("admin.exam.requireOutline") || "Require Outline"}
              </Label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <Label htmlFor="allowedFormats">
                {t("admin.exam.allowedFormats") || "Allowed Formats"}
              </Label>
              <select
                id="allowedFormats"
                className="form-control"
                multiple
                value={localData.allowedFormats || ["HTML", "MARKDOWN", "PLAIN_TEXT"]}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  updateData({ ...localData, allowedFormats: selected });
                }}
              >
                <option value="HTML">HTML</option>
                <option value="MARKDOWN">MARKDOWN</option>
                <option value="PLAIN_TEXT">PLAIN_TEXT</option>
              </select>
            </div>
          </div>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="MANUAL"
        />
      </div>
    );
  }

  // Ordering Template
  if (questionType === QuestionCreateRequestQuestionType.ORDERING) {
    const items = localData.options?.items || [];

    const addItem = () => {
      const newItem = {
        id: `item_${Date.now()}`,
        text: "",
        correctPosition: items.length + 1,
        mediaUrl: "",
      };
      updateData({
        ...localData,
        options: {
          ...localData.options,
          items: [...items, newItem],
        },
        shuffleItems: localData.shuffleItems ?? true,
        showFeedback: localData.showFeedback ?? false,
        scoringConfig: localData.scoringConfig || {
          strategy: "POSITION_BASED",
          allowPartialCredit: true,
          penaltyPerWrong: 0.0,
          roundScore: false,
          decimalPlaces: 2,
        },
      });
    };

    const updateItem = (index: number, field: string, value: any) => {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: value };
      updateData({
        ...localData,
        options: {
          ...localData.options,
          items: updated,
        },
      });
    };

    const removeItem = (index: number) => {
      const updated = items.filter((_: any, i: number) => i !== index);
      updateData({
        ...localData,
        options: {
          ...localData.options,
          items: updated,
        },
      });
    };

    return (
      <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
        <div className="d-flex justify-content-between align-items-center mb--20">
          <label className="mb--0">{t("admin.exam.items") || "Items"}</label>
          <button
            type="button"
            className="rbt-btn btn-sm btn-border-gradient"
            onClick={addItem}
          >
            <i className="feather-plus me-1"></i>
            {t("admin.exam.addItem") || "Add Item"}
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-muted text-center py--20">
            {t("admin.exam.noItems") || "No items added"}
          </p>
        ) : (
          <div className="row g-3">
            {items.map((item: any, index: number) => (
              <div key={item.id || index} className="col-12">
                <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#ffffff' }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <Label htmlFor={`item-text-${index}`}>
                          {t("admin.exam.itemText") || "Item Text"} {index + 1}
                        </Label>
                        <Input
                          id={`item-text-${index}`}
                          value={item.text || ""}
                          onChange={(e) => updateItem(index, "text", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <Label htmlFor={`item-position-${index}`}>
                          {t("admin.exam.correctPosition") || "Correct Position"}
                        </Label>
                        <Input
                          id={`item-position-${index}`}
                          type="number"
                          min="1"
                          value={item.correctPosition || index + 1}
                          onChange={(e) =>
                            updateItem(index, "correctPosition", parseInt(e.target.value))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <Label htmlFor={`item-media-${index}`}>
                          {t("admin.exam.mediaUrl") || "Media URL"}
                        </Label>
                        <div className="d-flex gap-2">
                          <Input
                            id={`item-media-${index}`}
                            value={item.mediaUrl || ""}
                            onChange={(e) => updateItem(index, "mediaUrl", e.target.value)}
                          />
                          <button
                            type="button"
                            className="rbt-btn btn-sm btn-border"
                            onClick={() => removeItem(index)}
                          >
                            <i className="feather-trash-2"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="row g-3 mt--20">
          <div className="col-md-6">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="shuffleItems"
                checked={localData.shuffleItems ?? true}
                onChange={(e) =>
                  updateData({ ...localData, shuffleItems: e.target.checked })
                }
              />
              <Label htmlFor="shuffleItems" className="cursor-pointer mb--0">
                {t("admin.exam.shuffleItems") || "Shuffle Items"}
              </Label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group d-flex gap-3 align-items-center">
              <input
                type="checkbox"
                id="showFeedback"
                checked={localData.showFeedback ?? false}
                onChange={(e) =>
                  updateData({ ...localData, showFeedback: e.target.checked })
                }
              />
              <Label htmlFor="showFeedback" className="cursor-pointer mb--0">
                {t("admin.exam.showFeedback") || "Show Feedback"}
              </Label>
            </div>
          </div>
        </div>

        <ScoringConfigForm
          scoringConfig={localData.scoringConfig}
          onChange={(config) => updateData({ ...localData, scoringConfig: config })}
          defaultStrategy="POSITION_BASED"
        />
      </div>
    );
  }

  // Default template for other question types (Hot Spot, Drag and Drop, Audio/Video/Image Response)
  return (
    <div className="rbt-card rbt-card-body" style={{ backgroundColor: '#f9fafb' }}>
      <div className="form-group">
        <label>{t("admin.exam.templateData")}</label>
        <Textarea
          value={JSON.stringify(localData, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              updateData(parsed);
            } catch {
              // Invalid JSON, keep as is
            }
          }}
          placeholder={t("admin.exam.templateDataJson")}
          rows={10}
          className="form-control"
          style={{ fontFamily: 'monospace', fontSize: '14px' }}
        />
        <small className="text-muted d-block mt--10">
          {t("admin.exam.templateDataJsonHint")}
        </small>
      </div>
    </div>
  );
}
