<?php 

if(isset($_POST['action'])){
	$request = $_REQUEST; 
	switch($request['action']) {
		case 'save_time_counter' :
			saveTimeCounterAction($request);
			break;
		case 'start_time_counter' :
			startTimeCounterAction($request);
			break;
		case 'pause_time_counter' :
			pauseTimeCounterAction($request);
			break;
		case 'stop_time_counter' :
			stopTimeCounterAction($request);
			break;
		case 'get_time_counter' :
			getTimeCounterAction($request);
			break;
		case 'finish_time_counter' :
			finishTimeCounterAction($request);
			break;
		case 'resume_time_counter' :
			resumeTimeCounterAction($request);
			break;
		case 'set_seen_time_counter' :
			setSeenTimeCounterAction($request);
			break;
		default: break;
	}
	/**
     * save time in database 
     * @param $request
     * @return JsonResponse
     */
     function saveTimeCounterAction($request) {
        $hoursFromUSer = $request["hours"];
        $mints = $request["mints"];
        if ($hoursFromUSer < 24 || $mints < 60) {
            $mintsFromUSer = $request["mints"];
            $secondsFromUSer = $request["seconds"];
            $user = $this->getUser();

            //$response = array(
            //    'success' => 'false',
            //    'message' => ''
            //);

            // get original user timezone
            //$timezone = $user->getTimezone();
            //$session = $this['session'];
            //if ($this->isGranted('ROLE_PREVIOUS_ADMIN') && $session->has('originalUser')) {
            //    $timezone = $session['originalUser']->timezone;
           // }

            $date = date("Y-m-d");
            $dateOFUSer = new \DateTime($date . " $hoursFromUSer:$mintsFromUSer:$secondsFromUSer");
// update the user objects
            //$em = $this->getDoctrine()->getManager();
            //$user->setOriginalTime($dateOFUSer);
            //$user->setNowTime($dateOFUSer);
            //$user->setFinishedTime(NULL);
            //$user->setPauseTime(true);

            //$em->persist($user);
            //$em->flush();

            $response = array(
                'success' => 'true',
                'message' => 'Time set successfully'
            );

            return new JsonResponse(
                    $response
            );
        }
        if ($hoursFromUSer > 24 && $$mints > 60) {
            $message = "Set Hr less than 24 and Min less than 60";
        } elseif ($hoursFromUSer > 24) {
            $message = 'Set Hours less than 24';
        } elseif ($mints > 60) {
            $message = 'Set Min less than 24';
        }


        $response = array(
            'success' => 'false',
            'message' => $message
        );
        return new JsonResponse(
                $response
        );
    }

     function startTimeCounterAction($request) {
        $user = $this->getUser();


        $date = date("Y-m-d H:i:s");
        $dateOFUSer = new \DateTime($date);
// update the user objects
        $em = $this->getDoctrine()->getManager();
        $user->setStartTime($dateOFUSer);
        $user->setPauseTime(false);

        $em->persist($user);
        $em->flush();

        $response = array(
            'success' => 'true',
                // 'message' => 'Time set successfully'
        );
        return new JsonResponse(
                $response
        );
    }

     function pauseTimeCounterAction($request) {
        $hoursFromUSer = $request["hours"];
        $mintsFromUSer = $request["mints"];
        $secondsFromUSer = $request["seconds"];
        $user = $this->getUser();
        $response = array(
            'success' => 'false',
            'message' => ''
        );
        $date = date("Y-m-d");
        $dateOFUSer = new \DateTime($date . " $hoursFromUSer:$mintsFromUSer:$secondsFromUSer");

        // update the user objects
        $em = $this->getDoctrine()->getManager();
        $user->setNowTime($dateOFUSer);
        $user->setPauseTime(true);
        $em->persist($user);
        $em->flush();

        // Update the message will appear to client
        $response = array(
            'success' => 'true',
                // 'message' => 'Time set successfully'
        );
        return new JsonResponse(
                $response
        );
    }

     function stopTimeCounterAction($request) {
        $user = $this->getUser();
        $response = array(
            'success' => 'false',
            'message' => ''
        );

// get the set time of user 
        $timeFromUSer = $user->getOriginalTime();
        if ($timeFromUSer) {


            $em = $this->getDoctrine()->getManager();
            $user->setOriginalTime($timeFromUSer);
            $user->setNowTime($timeFromUSer);
            $user->setPauseTime(true);
            $em->persist($user);
            $em->flush();


            $timeOfUserFormat = $timeFromUSer->format('H:i:s');
            $timeOfUserFormat = explode(":", $timeOfUserFormat);


            $response = array(
                'success' => 'true',
                'second' => $timeOfUserFormat[2],
                'mint' => $timeOfUserFormat[1],
                'hours' => $timeOfUserFormat[0],
            );
        }
        return new JsonResponse(
                $response
        );
    }

     function getTimeCounterAction($request) {

        $user = $this->getUser();
        $startDate = $user->getStartTime();
        $nowTime = $user->getNowTime();
        $originalTime = $user->getOriginalTime();
        $pauseTime = $user->getPauseTime();



        $response = array(
            'success' => 'false',
        );


        if ($nowTime) {

            if (!$pauseTime) {

                $date = date("Y-m-d H:i:s");
                $now = new \DateTime($date);


                $diff = strtotime($now->format('H:i:s')) - strtotime($startDate->format('H:i:s'));

                $x = 60 * 60 * $nowTime->format('H') + 60 * $nowTime->format('i') + $nowTime->format('s');

                $seconds = $x - $diff;
                $hours = floor($seconds / 3600);
                $mins = floor($seconds / 60 % 60);
                $secs = floor($seconds % 60);




                $response = array(
                    'success' => 'true',
                    'second' => $secs,
                    'mint' => $mins,
                    'hours' => $hours,
                    'pause' => $pauseTime
                );

                return new JsonResponse(
                        $response
                );
            }

            $timeOfUserFormat = explode(":", $nowTime->format('H:i:s'));


            $response = array(
                'success' => 'true',
                'second' => $timeOfUserFormat[2],
                'mint' => $timeOfUserFormat[1],
                'hours' => $timeOfUserFormat[0],
                'pause' => $pauseTime
            );
        }

        return new JsonResponse(
                $response
        );
    }

    /**
     * finish time counter
     * @param $request
     * @return JsonResponse
     */
     function finishTimeCounterAction($request) {
        $user = $this->getUser();
        $timer = $user->getOriginalTime();
        //$timeOfUserFormat = explode(":", $timer);
        $em = $this->getDoctrine()->getManager();
        $user->setStartTime(NULL);
        $user->setSeenTimer(false);
        $user->setNowTime(NULL);
        $user->setOriginalTime(NULL);
        $user->setPauseTime(NULL);
        if ($timer) {
            $user->setFinishedTime($timer);
        }
        $em->persist($user);
        $em->flush();


        $response = array(
            'success' => 'true',
            "message" => "Time Passed! you spent " . $user->getFinishedTime()->format('H:i') . ". " . "<br>" . "Check your progress, or reset and start again!"
        );

        return new JsonResponse(
                $response
        );
    }

    /**
     * resume time counter
     * @param $request
     * @return JsonResponse
     */
     function resumeTimeCounterAction($request) {
        $hoursFromUSer = $request["hours"];
        $mintsFromUSer = $request["mints"];
        $secondsFromUSer = $request["seconds"];
        $user = $this->getUser();
        $response = array(
            'success' => 'false',
            'message' => ''
        );
        $date = date("Y-m-d H:i:s");
        $dateOFUSer = new \DateTime($date);
        // update the user objects
        $em = $this->getDoctrine()->getManager();
        $user->setStartTime($dateOFUSer);
        $user->setPauseTime(false);
        $em->persist($user);
        $em->flush();

        // Update the message will appear to client
        $response = array(
            'success' => 'true',
                // 'message' => 'Time set successfully'
        );
        return new JsonResponse(
                $response
        );
    }

     function setSeenTimerAction($request) {
        $user = $this->getUser();
        $response = array(
            'success' => 'false',
            'message' => ''
        );
        $em = $this->getDoctrine()->getManager();
        $user->setSeenTimer(true);
        $em->persist($user);
        $em->flush();

        // Update the message will appear to client
        $response = array(
            'success' => 'true',
                // 'message' => 'Time set successfully'
        );
        return new JsonResponse(
                $response
        );
    }
}
?>