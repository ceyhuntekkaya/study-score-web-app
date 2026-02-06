"use client";

import { useTranslation } from "@/i18n";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";

export const DEFAULT_SCORING_CONFIG = {
  strategy: "BINARY",
  allowPartialCredit: false,
  penaltyPerWrong: 0.0,
  roundScore: false,
  decimalPlaces: 2,
} as const;

export type DefaultScoringConfig = Partial<{
  strategy: string;
  allowPartialCredit: boolean;
  penaltyPerWrong: number;
  roundScore: boolean;
  decimalPlaces: number;
}>;

interface ScoringConfigFormProps {
  scoringConfig: any;
  onChange: (config: any) => void;
  /** @deprecated Prefer defaultConfig for full defaults */
  defaultStrategy?: string;
  /** Optional default values; merged when scoringConfig is missing or partial */
  defaultConfig?: DefaultScoringConfig;
}

export default function ScoringConfigForm({
  scoringConfig,
  onChange,
  defaultStrategy = "BINARY",
  defaultConfig,
}: ScoringConfigFormProps) {
  const { t } = useTranslation();
  const baseDefaults = defaultConfig
    ? { ...DEFAULT_SCORING_CONFIG, ...defaultConfig }
    : { ...DEFAULT_SCORING_CONFIG, strategy: defaultStrategy };
  const config = scoringConfig
    ? { ...baseDefaults, ...scoringConfig }
    : { ...baseDefaults };

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
            <Select
              id="scoringStrategy"
              value={config.strategy ?? baseDefaults.strategy}
              onChange={(e) => updateConfig("strategy", e.target.value)}
            >
              <option value="BINARY">BINARY</option>
              <option value="PROPORTIONAL">PROPORTIONAL</option>
              <option value="POSITION_BASED">POSITION_BASED</option>
              <option value="MANUAL">MANUAL</option>
              <option value="HYBRID">HYBRID</option>
            </Select>
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
              value={config.decimalPlaces ?? baseDefaults.decimalPlaces ?? 2}
              onChange={(e) => updateConfig("decimalPlaces", parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="allowPartialCredit"
              checked={config.allowPartialCredit ?? baseDefaults.allowPartialCredit ?? false}
              onChange={(e) => updateConfig("allowPartialCredit", e.target.checked)}
              label={t("admin.exam.allowPartialCredit") || "Allow Partial Credit"}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <Checkbox
              id="roundScore"
              checked={config.roundScore ?? baseDefaults.roundScore ?? false}
              onChange={(e) => updateConfig("roundScore", e.target.checked)}
              label={t("admin.exam.roundScore") || "Round Score"}
            />
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
              value={config.penaltyPerWrong ?? baseDefaults.penaltyPerWrong ?? 0}
              onChange={(e) => updateConfig("penaltyPerWrong", parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
