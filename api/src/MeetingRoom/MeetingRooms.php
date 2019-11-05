<?php declare(strict_types=1);

namespace Multi\MeetingRoom;

use Multi\Context;
use Multi\Resolver;

class MeetingRooms implements Resolver
{
    public function __invoke($root, array $args, Context $context)
    {
        $meetingRooms = $context->db->meetingRooms();
        var_dump($meetingRooms);
        return $meetingRooms;
    }
}
