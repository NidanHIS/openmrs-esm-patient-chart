import { DiagnosisTags, type Visit } from '@openmrs/esm-framework';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './visit-diagnoses-cell.scss'

interface Props {
  visit: Visit;
  patient: fhir.Patient;
}

const VisitDiagnosisCell: React.FC<Props> = ({ visit }) => {
  const { t } = useTranslation();

  const diagnoses = visit.encounters
    .flatMap((encounter) => encounter.diagnoses)
    .filter((diagnosis) => !diagnosis.voided);

  const provisionalDiagnoses = diagnoses
    .filter((d) => d.certainty?.toUpperCase() === 'PROVISIONAL' || !d.certainty)
    .sort((a, b) => a.rank - b.rank);

  const finalDiagnoses = diagnoses
    .filter((d) => d.certainty?.toUpperCase() === 'CONFIRMED')
    .sort((a, b) => a.rank - b.rank);

  if (diagnoses.length === 0) {
    return <span>--</span>;
  }

  return (
    <div className={styles.container}>
      {provisionalDiagnoses.length > 0 && (
        <div className={styles.row}>
          <span className={`${styles.label} ${styles.provisionalLabel}`}>
            {t('provisional', 'Provisional')}:
          </span>
          <DiagnosisTags diagnoses={provisionalDiagnoses} />
        </div>
      )}

      {finalDiagnoses.length > 0 && (
        <div className={styles.row}>
          <span className={`${styles.label} ${styles.finalLabel}`}>
            {t('final', 'Final')}:
          </span>
          <DiagnosisTags diagnoses={finalDiagnoses} />
        </div>
      )}
    </div>
  );
};

export default VisitDiagnosisCell;