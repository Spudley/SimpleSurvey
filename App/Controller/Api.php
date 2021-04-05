<?php
namespace App\Controller;

class Api
{
    public function post()
    {
        $postData = json_decode(file_get_contents("php://input"), true);
        $this->saveSurveySubmission($postData);
        $output = ['result'=>'success'];
        return $output;
    }

    /**
     * Ordinarily we would be going off to some business logic and model classes here to validate and save to a DB table.
     */
    private function saveSurveySubmission(array $data)
    {
        $_SESSION['survey_results'][] = $data;
    }

    /**
     * Not a real admin panel, and no security, but just for the sake of making it easy to view the session data...
     */
    public function get()
    {
        return $_SESSION;
    }
}

