import {
  IonDatetime,
  IonInput,
  IonItem,
  IonList,
  IonText,
  IonButton,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  useIonToast,
  IonIcon,
} from "@ionic/react";
import { useState, useCallback, useMemo } from "react";
import {
  closeOutline,
  calendarOutline,
  trashOutline,
  checkmarkOutline,
} from "ionicons/icons";
import "./ExploreContainer.css";

interface ContainerProps {
  name?: string;
}

interface RecordData {
  name: string;
  dob: string | null;
  age: number | null;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [dob, setDob] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [presentToast] = useIonToast();

  // Calculate age based on DOB
  const age = useMemo(() => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    return calculatedAge;
  }, [dob]);

  // Handle date change
  const handleDateChange = useCallback((e: CustomEvent) => {
    setDob(e.detail.value as string);
    setShowDatePicker(false);
  }, []);

  // Clear selected date
  const clearDate = useCallback(() => {
    setDob(null);
  }, []);

  // Format date for display
  const formattedDate = useMemo(() => {
    if (!dob) return "";
    return new Date(dob).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [dob]);

  // Prepare record data
  const recordData = useMemo<RecordData>(
    () => ({
      name: companyName || "Sample Company",
      dob,
      age,
    }),
    [companyName, dob, age]
  );

  // Simulate API save with better error handling
  const saveToApi = useCallback(async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await presentToast({
        message: "Record saved successfully!",
        duration: 2000,
        color: "success",
        position: "top",
        icon: checkmarkOutline,
      });

      setShowModal(false);
    } catch (error) {
      console.error("API Error:", error);
      await presentToast({
        message: "Failed to save record. Please try again.",
        duration: 3000,
        color: "danger",
        position: "top",
      });
    }
  }, [recordData, presentToast]);

  // Validate form before submission
  const validateForm = useCallback(() => {
    if (!companyName.trim()) {
      presentToast({
        message: "Please enter a company name",
        duration: 2000,
        color: "warning",
      });
      return false;
    }
    if (!dob) {
      presentToast({
        message: "Please select a date",
        duration: 2000,
        color: "warning",
      });
      return false;
    }
    return true;
  }, [companyName, dob, presentToast]);

  // Handle save button click with validation
  const handleSaveClick = useCallback(() => {
    if (validateForm()) {
      setShowModal(true);
    }
  }, [validateForm]);

  return (
    <div className="explore-container">
      <IonList className="ion-padding" lines="full">
        <IonItem>
          <IonText slot="start" className="input-label">
            Company Name
          </IonText>
          <IonInput
            placeholder="Enter company name"
            value={companyName}
            onIonChange={(e) => setCompanyName(e.detail.value || "")}
            clearInput
            required
            className="custom-input"
          />
        </IonItem>

        <IonItem>
          <IonText slot="start" className="input-label">
            Date of Birth
          </IonText>
          <div className="date-input-container">
            <IonInput
              readonly
              placeholder="Select date"
              value={formattedDate}
              onClick={() => setShowDatePicker(true)}
              className="custom-input date-input"
            />
          </div>
          {dob && (
            <IonButton
              fill="clear"
              onClick={clearDate}
              className="clear-button"
              title="Clear date"
            >
              <IonIcon icon={trashOutline} slot="icon-only" />
            </IonButton>
          )}
        </IonItem>

        {age !== null && (
          <IonItem className="age-display">
            <IonText>
              Age: <strong>{age}</strong> years
            </IonText>
          </IonItem>
        )}

        <IonItem lines="none" className="save-button-container">
          <IonButton
            expand="block"
            onClick={handleSaveClick}
            disabled={!companyName.trim() || !dob}
            className="save-button"
          >
            <IonIcon icon={checkmarkOutline} slot="start" />
            Save Record
          </IonButton>
        </IonItem>
      </IonList>

      {/* Date Picker Modal */}
      <IonModal
        isOpen={showDatePicker}
        onDidDismiss={() => setShowDatePicker(false)}
        className="date-picker-modal"
        style={{ "--width": "fit-content", "--height": "fit-content" }}
      >
        <IonDatetime
          presentation="date"
          value={dob}
          onIonChange={handleDateChange}
          max={new Date().toISOString()}
          className="custom-datetime"
          showDefaultButtons={true}
        />
      </IonModal>

      {/* Confirmation Modal */}
      <IonModal
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
        className="confirmation-modal"
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Confirm Save</IonTitle>
            <IonButtons slot="end">
              <IonButton
                onClick={() => setShowModal(false)}
                className="modal-close-button"
              >
                <IonIcon icon={closeOutline} slot="icon-only" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <div className="confirmation-details">
            <h3>Record Details:</h3>
            <div className="detail-row">
              <span className="detail-label">Company:</span>
              <span className="detail-value">{recordData.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formattedDate || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{age ?? "N/A"} years</span>
            </div>
          </div>

          <IonButton
            expand="block"
            onClick={saveToApi}
            className="confirm-save-button"
          >
            <IonIcon icon={checkmarkOutline} slot="start" />
            Confirm Save
          </IonButton>
        </IonContent>
      </IonModal>
    </div>
  );
};

export default ExploreContainer;
